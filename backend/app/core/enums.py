"""Domain enums for roles, statuses, and shared constants."""

from enum import Enum


class RoleEnum(str, Enum):
    """System roles for RBAC."""

    ADMINISTRATOR = "administrator"
    MANAGER = "manager"
    CAPTAIN = "captain"
    KITCHEN = "kitchen"
    CASHIER = "cashier"
    CUSTOMER = "customer"


class PermissionEnum(str, Enum):
    """Fine-grained permissions."""

    # Dashboard
    VIEW_DASHBOARD = "view_dashboard"
    VIEW_SALES = "view_sales"

    # Orders
    TAKE_ORDERS = "take_orders"
    MODIFY_ORDERS = "modify_orders"
    VIEW_ORDERS = "view_orders"
    SEND_KOT = "send_kot"
    CANCEL_ORDERS = "cancel_orders"

    # Kitchen
    VIEW_KOT = "view_kot"
    UPDATE_KOT_STATUS = "update_kot_status"

    # Billing
    GENERATE_BILL = "generate_bill"
    RECEIVE_PAYMENT = "receive_payment"
    PRINT_RECEIPT = "print_receipt"
    VIEW_PAYMENTS = "view_payments"

    # Inventory
    VIEW_INVENTORY = "view_inventory"
    MODIFY_INVENTORY = "modify_inventory"

    # Reports
    VIEW_REPORTS = "view_reports"

    # Employees
    VIEW_EMPLOYEES = "view_employees"
    MANAGE_EMPLOYEES = "manage_employees"

    # Customers
    VIEW_CUSTOMERS = "view_customers"
    MANAGE_CUSTOMERS = "manage_customers"

    # Menu
    VIEW_MENU = "view_menu"
    MANAGE_MENU = "manage_menu"

    # Settings
    VIEW_SETTINGS = "view_settings"
    MANAGE_SETTINGS = "manage_settings"

    # Notifications
    VIEW_NOTIFICATIONS = "view_notifications"

    # Feedback
    VIEW_FEEDBACK = "view_feedback"
    SUBMIT_FEEDBACK = "submit_feedback"

    # Tables
    VIEW_TABLES = "view_tables"
    MANAGE_TABLES = "manage_tables"

    # Full access
    FULL_ACCESS = "full_access"


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    SERVED = "served"
    HELD = "held"
    BILLED = "billed"
    PAID = "paid"
    CANCELLED = "cancelled"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethod(str, Enum):
    CASH = "cash"
    CARD = "card"
    UPI = "upi"
    WALLET = "wallet"


class TableStatus(str, Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    RESERVED = "reserved"
    BILLING = "billing"


class InventoryTransactionType(str, Enum):
    PURCHASE = "purchase"
    CONSUMPTION = "consumption"
    ADJUSTMENT = "adjustment"
    WASTAGE = "wastage"
    RETURN = "return"


class EmployeeStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ON_LEAVE = "on_leave"


class NotificationType(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ALERT = "alert"
    ORDER = "order"
    SYSTEM = "system"
