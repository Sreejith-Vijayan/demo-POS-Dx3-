"""Domain Pydantic schemas (request/response DTOs)."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel, TimestampSchema


# --- Menu ---
class MenuCategoryOut(ORMModel, TimestampSchema):
    id: int
    name: str
    description: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class MenuItemOut(ORMModel, TimestampSchema):
    id: int
    name: str
    description: Optional[str] = None
    price: Decimal
    category_id: int
    is_veg: bool = True
    is_available: bool = True
    preparation_time_mins: int = 15


class MenuItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    category_id: int
    is_veg: bool = True


# --- Orders ---
class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = Field(ge=1, default=1)
    notes: Optional[str] = None


class OrderCreate(BaseModel):
    table_id: Optional[int] = None
    customer_id: Optional[int] = None
    order_type: str = "dine_in"
    items: List[OrderItemCreate] = []
    notes: Optional[str] = None


class OrderItemOut(ORMModel):
    id: int
    menu_item_id: int
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    status: str
    kot_sent: bool = False


class OrderOut(ORMModel, TimestampSchema):
    id: int
    order_number: str
    table_id: Optional[int] = None
    customer_id: Optional[int] = None
    status: str
    order_type: str
    subtotal: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    items: List[OrderItemOut] = []


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    items: Optional[List[OrderItemCreate]] = None


class OrderCancelItem(BaseModel):
    order_item_id: int
    reason: str


# --- Tables ---
class TableOut(ORMModel):
    id: int
    number: int
    name: str
    capacity: int
    status: str
    floor: Optional[str] = None


# --- Kitchen ---
class KitchenStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


# --- Payments ---
class PaymentCreate(BaseModel):
    order_id: int
    amount: Decimal
    method: str
    transaction_ref: Optional[str] = None


class PaymentOut(ORMModel, TimestampSchema):
    id: int
    payment_number: str
    order_id: int
    amount: Decimal
    method: str
    status: str


# --- Inventory ---
class InventoryItemOut(ORMModel):
    id: int
    sku: str
    name: str
    unit: str
    quantity_on_hand: Decimal
    reorder_level: Decimal
    unit_cost: Decimal
    category: Optional[str] = None


# --- Customers / Employees ---
class CustomerOut(ORMModel):
    id: int
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    loyalty_points: int = 0
    visit_count: int = 0


class EmployeeOut(ORMModel):
    id: int
    employee_code: str
    full_name: str
    role_name: str
    status: str
    phone: Optional[str] = None
    email: Optional[str] = None


# --- Dashboard / Reports / Settings ---
class DashboardStats(BaseModel):
    today_sales: Decimal
    today_orders: int
    active_tables: int
    pending_kots: int
    low_stock_items: int
    today_customers: int


class ReportSalesOut(BaseModel):
    period: str
    total_sales: Decimal
    total_orders: int
    average_order_value: Decimal
    top_items: List[dict] = []


class SettingOut(ORMModel):
    id: int
    key: str
    value: str
    category: str
    description: Optional[str] = None


class NotificationOut(ORMModel, TimestampSchema):
    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    link: Optional[str] = None


class FeedbackCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None
    order_id: Optional[int] = None
    customer_id: Optional[int] = None


class FeedbackOut(ORMModel, TimestampSchema):
    id: int
    rating: int
    comment: Optional[str] = None
    source: str
    status: str
