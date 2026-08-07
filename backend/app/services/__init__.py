"""Service layer — business logic stubs with dependency injection."""

from decimal import Decimal
from typing import List, Optional

from fastapi import Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import MenuItem, Order, OrderItem
from app.repositories import (
    CustomerRepository,
    EmployeeRepository,
    FeedbackRepository,
    InventoryRepository,
    MenuCategoryRepository,
    MenuItemRepository,
    NotificationRepository,
    OrderRepository,
    PaymentRepository,
    SettingRepository,
    TableRepository,
)
from app.core.enums import OrderStatus
from app.schemas import (
    DashboardStats,
    FeedbackCreate,
    OrderCreate,
    OrderUpdate,
    PaymentCreate,
    ReportSalesOut,
)


class MenuService:
    def __init__(self, db: Session):
        self.categories = MenuCategoryRepository(db)
        self.items = MenuItemRepository(db)

    def list_categories(self):
        return self.categories.list(limit=100)

    def list_items(self, category_id: Optional[int] = None):
        if category_id:
            return self.items.list_by_category(category_id)
        return self.items.list(limit=200)

    def get_item(self, item_id: int):
        return self.items.get(item_id)


class OrderService:
    def __init__(self, db: Session):
        self.orders = OrderRepository(db)
        self.db = db

    def list_orders(self) -> List[Order]:
        return self.orders.list(limit=100)

    def get_order(self, order_id: int) -> Optional[Order]:
        return self.orders.get(order_id)

    def get_orders_by_table(self, table_id: int) -> List[Order]:
        return (
            self.db.query(Order)
            .filter(Order.table_id == table_id)
            .order_by(Order.created_at.desc())
            .all()
        )

    def get_current_order(self, table_id: int) -> Optional[Order]:
        return (
            self.db.query(Order)
            .filter(
                Order.table_id == table_id,
                Order.status.in_(["pending", "confirmed", "preparing", "held"]),
            )
            .order_by(Order.created_at.desc())
            .first()
        )

    def _next_order_number(self) -> str:
        count = max(self.orders.count() or 0, 0)
        return f"ORD-{count + 1:05d}"

    def create_order(self, payload: OrderCreate) -> dict:
        items = []
        subtotal = 0
        tax_amount = 0

        for item_payload in payload.items:
            menu_item = self.db.get(MenuItem, item_payload.menu_item_id)
            if not menu_item:
                continue
            line_total = float(menu_item.price) * item_payload.quantity
            item_tax = line_total * float(menu_item.tax_percent or 0) / 100.0
            subtotal += line_total
            tax_amount += item_tax
            items.append(
                OrderItem(
                    menu_item_id=menu_item.id,
                    quantity=item_payload.quantity,
                    unit_price=menu_item.price,
                    tax_amount=item_tax,
                    total_price=line_total + item_tax,
                    status="pending",
                    notes=item_payload.notes,
                )
            )

        order = Order(
            order_number=self._next_order_number(),
            table_id=payload.table_id,
            customer_id=payload.customer_id,
            order_type=payload.order_type,
            status="pending",
            subtotal=subtotal,
            tax_amount=tax_amount,
            discount_amount=0,
            total_amount=subtotal + tax_amount,
            notes=payload.notes,
        )
        self.db.add(order)
        self.db.flush()

        for item in items:
            item.order_id = order.id
            self.db.add(item)

        self.db.commit()
        self.db.refresh(order)
        return {
            "id": order.id,
            "order_number": order.order_number,
            "status": order.status,
            "subtotal": float(order.subtotal),
            "tax_amount": float(order.tax_amount),
            "total_amount": float(order.total_amount),
            "table_id": order.table_id,
            "items": [
                {
                    "id": i.id,
                    "menu_item_id": i.menu_item_id,
                    "quantity": i.quantity,
                    "unit_price": float(i.unit_price),
                    "total_price": float(i.total_price),
                    "status": i.status,
                    "kot_sent": i.kot_sent,
                    "notes": i.notes,
                }
                for i in order.items
            ],
        }

    def update_order(self, order_id: int, payload: OrderUpdate) -> dict:
        order = self.get_order(order_id)
        if not order:
            return {"id": order_id, "message": "Order not found"}

        if order.status in ["billed", "paid", "completed", "cancelled"]:
            return {"id": order_id, "message": "Cannot modify completed or billed order"}

        if payload.notes is not None:
            order.notes = payload.notes

        if payload.status is not None:
            order.status = payload.status

        if payload.items is not None:
            for item in order.items:
                self.db.delete(item)
            self.db.flush()

            subtotal = 0
            tax_amount = 0
            new_items = []
            for item_payload in payload.items:
                menu_item = self.db.get(MenuItem, item_payload.menu_item_id)
                if not menu_item:
                    continue
                line_total = float(menu_item.price) * item_payload.quantity
                item_tax = line_total * float(menu_item.tax_percent or 0) / 100.0
                subtotal += line_total
                tax_amount += item_tax
                new_items.append(
                    OrderItem(
                        order_id=order.id,
                        menu_item_id=menu_item.id,
                        quantity=item_payload.quantity,
                        unit_price=menu_item.price,
                        tax_amount=item_tax,
                        total_price=line_total + item_tax,
                        status="pending",
                        notes=item_payload.notes,
                    )
                )
            order.subtotal = subtotal
            order.tax_amount = tax_amount
            order.total_amount = subtotal + tax_amount
            for item in new_items:
                self.db.add(item)

        self.db.commit()
        self.db.refresh(order)
        return {
            "id": order.id,
            "status": order.status,
            "subtotal": float(order.subtotal),
            "tax_amount": float(order.tax_amount),
            "total_amount": float(order.total_amount),
            "items": [
                {
                    "id": i.id,
                    "menu_item_id": i.menu_item_id,
                    "quantity": i.quantity,
                    "unit_price": float(i.unit_price),
                    "total_price": float(i.total_price),
                    "status": i.status,
                    "kot_sent": i.kot_sent,
                    "notes": i.notes,
                }
                for i in order.items
            ],
        }

    def delete_order(self, order_id: int) -> dict:
        # TODO: Soft-cancel with audit log
        return {"id": order_id, "message": "Order delete stub"}

    def hold_order(self, order_id: int) -> dict:
        order = self.get_order(order_id)
        if not order:
            return {"id": order_id, "message": "Order not found"}
        if order.status in [OrderStatus.BILLED.value, OrderStatus.PAID.value, OrderStatus.CANCELLED.value]:
            return {"id": order_id, "message": "Cannot hold completed or billed order"}
        order.status = OrderStatus.HELD.value
        self.db.commit()
        self.db.refresh(order)
        return {"id": order.id, "status": order.status}

    def resume_order(self, order_id: int) -> dict:
        order = self.get_order(order_id)
        if not order:
            return {"id": order_id, "message": "Order not found"}
        if order.status != OrderStatus.HELD.value:
            return {"id": order_id, "message": "Only held orders can be resumed"}
        order.status = OrderStatus.PENDING.value
        self.db.commit()
        self.db.refresh(order)
        return {"id": order.id, "status": order.status}

    def send_kot(self, order_id: int) -> dict:
        order = self.get_order(order_id)
        if not order:
            return {"id": order_id, "message": "Order not found"}
        if not order.items:
            return {"id": order_id, "message": "Cannot send empty order"}
        for item in order.items:
            item.kot_sent = True
            if item.status == OrderStatus.PENDING.value:
                item.status = OrderStatus.CONFIRMED.value
        order.status = OrderStatus.CONFIRMED.value
        self.db.commit()
        self.db.refresh(order)
        return {"id": order.id, "status": order.status, "message": "KOT sent"}

    def cancel_order_item(self, order_id: int, order_item_id: int, reason: str) -> dict:
        order = self.get_order(order_id)
        if not order:
            return {"id": order_id, "message": "Order not found"}
        item = self.db.get(OrderItem, order_item_id)
        if not item or item.order_id != order_id:
            return {"id": order_id, "message": "Order item not found"}
        if order.status in [OrderStatus.BILLED.value, OrderStatus.PAID.value, OrderStatus.COMPLETED.value, OrderStatus.CANCELLED.value]:
            return {"id": order_id, "message": "Cannot cancel items from completed or billed order"}
        item.status = OrderStatus.CANCELLED.value
        item.notes = f"Cancelled: {reason}"
        self.db.commit()
        self.db.refresh(item)
        return {
            "order_id": order_id,
            "order_item_id": item.id,
            "status": item.status,
            "reason": reason,
        }

    def get_order_status(self, order_id: int) -> dict:
        order = self.get_order(order_id)
        if not order:
            return {"id": order_id, "message": "Order not found"}
        return {"id": order.id, "status": order.status, "updated_at": order.updated_at.isoformat() if order.updated_at else None}

    def get_order_history(self, table_id: int) -> List[Order]:
        return (
            self.db.query(Order)
            .filter(Order.table_id == table_id)
            .order_by(Order.created_at.desc())
            .limit(50)
            .all()
        )


class CaptainService:
    def __init__(self, db: Session):
        self.tables = TableRepository(db)
        self.orders = OrderRepository(db)

    def list_tables(self):
        return self.tables.list(limit=50)

    def list_captain_orders(self):
        return self.orders.list(limit=50)


class KitchenService:
    def __init__(self, db: Session):
        self.orders = OrderRepository(db)

    def list_kitchen_orders(self):
        return self.orders.get_kitchen_orders()

    def update_status(self, order_id: int, status: str) -> dict:
        # TODO: Validate status transitions, notify captain/cashier
        return {"id": order_id, "status": status, "message": "Kitchen status update stub"}


class CashierService:
    def __init__(self, db: Session):
        self.payments = PaymentRepository(db)
        self.orders = OrderRepository(db)

    def create_payment(self, payload: PaymentCreate) -> dict:
        # TODO: Full payment flow, change calculation, receipt
        return {
            "payment_number": "PAY-TODO",
            "status": "completed",
            "message": "Payment stub",
            "payload": payload.model_dump(),
        }

    def list_payments(self):
        return self.payments.list(limit=100)


class DashboardService:
    def __init__(self, db: Session):
        self.orders = OrderRepository(db)
        self.tables = TableRepository(db)
        self.inventory = InventoryRepository(db)

    def get_stats(self) -> DashboardStats:
        # TODO: Replace with real aggregations
        low = len(self.inventory.low_stock())
        return DashboardStats(
            today_sales=Decimal("12450.00"),
            today_orders=42,
            active_tables=8,
            pending_kots=5,
            low_stock_items=low or 3,
            today_customers=28,
        )


class InventoryService:
    def __init__(self, db: Session):
        self.repo = InventoryRepository(db)

    def list_items(self):
        return self.repo.list(limit=200)


class ReportService:
    def __init__(self, db: Session):
        self.db = db

    def sales_report(self) -> ReportSalesOut:
        # TODO: Aggregate from orders/payments
        return ReportSalesOut(
            period="today",
            total_sales=Decimal("12450.00"),
            total_orders=42,
            average_order_value=Decimal("296.43"),
            top_items=[
                {"name": "Cappuccino", "qty": 48},
                {"name": "Margherita Pizza", "qty": 22},
                {"name": "Chocolate Brownie", "qty": 18},
            ],
        )


class EmployeeService:
    def __init__(self, db: Session):
        self.repo = EmployeeRepository(db)

    def list_employees(self):
        return self.repo.list(limit=100)


class CustomerService:
    def __init__(self, db: Session):
        self.repo = CustomerRepository(db)

    def list_customers(self):
        return self.repo.list(limit=100)


class SettingsService:
    def __init__(self, db: Session):
        self.repo = SettingRepository(db)

    def list_settings(self):
        return self.repo.list(limit=100)


class NotificationService:
    def __init__(self, db: Session):
        self.repo = NotificationRepository(db)

    def list_notifications(self):
        return self.repo.list(limit=50)


class FeedbackService:
    def __init__(self, db: Session):
        self.repo = FeedbackRepository(db)

    def list_feedback(self):
        return self.repo.list(limit=50)

    def submit(self, payload: FeedbackCreate) -> dict:
        # TODO: Persist feedback and notify managers
        return {"message": "Feedback received (stub)", "payload": payload.model_dump()}


# --- DI factories ---


def get_menu_service(db: Session = Depends(get_db)) -> MenuService:
    return MenuService(db)


def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    return OrderService(db)


def get_captain_service(db: Session = Depends(get_db)) -> CaptainService:
    return CaptainService(db)


def get_kitchen_service(db: Session = Depends(get_db)) -> KitchenService:
    return KitchenService(db)


def get_cashier_service(db: Session = Depends(get_db)) -> CashierService:
    return CashierService(db)


def get_dashboard_service(db: Session = Depends(get_db)) -> DashboardService:
    return DashboardService(db)


def get_inventory_service(db: Session = Depends(get_db)) -> InventoryService:
    return InventoryService(db)


def get_report_service(db: Session = Depends(get_db)) -> ReportService:
    return ReportService(db)


def get_employee_service(db: Session = Depends(get_db)) -> EmployeeService:
    return EmployeeService(db)


def get_customer_service(db: Session = Depends(get_db)) -> CustomerService:
    return CustomerService(db)


def get_settings_service(db: Session = Depends(get_db)) -> SettingsService:
    return SettingsService(db)


def get_notification_service(db: Session = Depends(get_db)) -> NotificationService:
    return NotificationService(db)


def get_feedback_service(db: Session = Depends(get_db)) -> FeedbackService:
    return FeedbackService(db)
