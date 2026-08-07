"""Domain repositories — thin data access layers."""

from typing import List, Optional

from sqlalchemy.orm import Session

from backend.app.models import (
    Customer,
    Employee,
    Feedback,
    InventoryItem,
    MenuCategory,
    MenuItem,
    Notification,
    Order,
    Payment,
    Setting,
    Table,
)
from backend.app.repositories.base import BaseRepository


class MenuCategoryRepository(BaseRepository[MenuCategory]):
    def __init__(self, db: Session):
        super().__init__(MenuCategory, db)

    def get_by_name(self, name: str) -> Optional[MenuCategory]:
        return self.db.query(MenuCategory).filter(MenuCategory.name == name).first()


class MenuItemRepository(BaseRepository[MenuItem]):
    def __init__(self, db: Session):
        super().__init__(MenuItem, db)

    def list_by_category(self, category_id: int) -> List[MenuItem]:
        return (
            self.db.query(MenuItem)
            .filter(MenuItem.category_id == category_id, MenuItem.is_active.is_(True))
            .all()
        )


class OrderRepository(BaseRepository[Order]):
    def __init__(self, db: Session):
        super().__init__(Order, db)

    def list_by_status(self, status: str) -> List[Order]:
        return self.db.query(Order).filter(Order.status == status).all()

    def get_kitchen_orders(self) -> List[Order]:
        return (
            self.db.query(Order)
            .filter(Order.status.in_(["confirmed", "preparing", "ready"]))
            .order_by(Order.created_at.asc())
            .all()
        )


class TableRepository(BaseRepository[Table]):
    def __init__(self, db: Session):
        super().__init__(Table, db)


class PaymentRepository(BaseRepository[Payment]):
    def __init__(self, db: Session):
        super().__init__(Payment, db)


class InventoryRepository(BaseRepository[InventoryItem]):
    def __init__(self, db: Session):
        super().__init__(InventoryItem, db)

    def low_stock(self) -> List[InventoryItem]:
        return (
            self.db.query(InventoryItem)
            .filter(InventoryItem.quantity_on_hand <= InventoryItem.reorder_level)
            .all()
        )


class CustomerRepository(BaseRepository[Customer]):
    def __init__(self, db: Session):
        super().__init__(Customer, db)


class EmployeeRepository(BaseRepository[Employee]):
    def __init__(self, db: Session):
        super().__init__(Employee, db)


class SettingRepository(BaseRepository[Setting]):
    def __init__(self, db: Session):
        super().__init__(Setting, db)

    def get_by_key(self, key: str) -> Optional[Setting]:
        return self.db.query(Setting).filter(Setting.key == key).first()


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, db: Session):
        super().__init__(Notification, db)


class FeedbackRepository(BaseRepository[Feedback]):
    def __init__(self, db: Session):
        super().__init__(Feedback, db)
