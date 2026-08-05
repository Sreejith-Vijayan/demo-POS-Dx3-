"""Service layer — business logic stubs with dependency injection."""

from decimal import Decimal
from typing import List, Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Order
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

    def create_order(self, payload: OrderCreate) -> dict:
        # TODO: Implement full order creation with stock checks, pricing, KOT
        return {
            "id": 0,
            "order_number": "TODO-0001",
            "status": "pending",
            "message": "Order creation stub — implement business logic",
            "payload": payload.model_dump(),
        }

    def update_order(self, order_id: int, payload: OrderUpdate) -> dict:
        # TODO: Implement order modification rules
        return {"id": order_id, "message": "Order update stub", "payload": payload.model_dump()}

    def delete_order(self, order_id: int) -> dict:
        # TODO: Soft-cancel with audit log
        return {"id": order_id, "message": "Order delete stub"}


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
