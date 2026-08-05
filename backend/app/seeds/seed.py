"""Seed realistic demo data for Cafe ERP."""

from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.enums import PermissionEnum, RoleEnum
from app.models import (
    Branch,
    Customer,
    Employee,
    Feedback,
    InventoryItem,
    MenuCategory,
    MenuItem,
    Notification,
    Order,
    OrderItem,
    Payment,
    Permission,
    Role,
    RolePermission,
    Setting,
    Table,
    User,
)
from app.permissions.matrix import ROLE_PERMISSIONS


def seed_all(db: Session) -> None:
    """Idempotent-ish seed: skip if roles already exist."""
    if db.query(Role).first():
        return

    # Roles & permissions
    role_map = {}
    for role_enum in RoleEnum:
        role = Role(name=role_enum.value, description=f"{role_enum.value} role")
        db.add(role)
        db.flush()
        role_map[role_enum.value] = role

    perm_map = {}
    for perm in PermissionEnum:
        p = Permission(code=perm.value, name=perm.value.replace("_", " ").title())
        db.add(p)
        db.flush()
        perm_map[perm.value] = p

    for role_enum, perms in ROLE_PERMISSIONS.items():
        role = role_map[role_enum.value]
        for perm in perms:
            db.add(
                RolePermission(
                    role_id=role.id,
                    permission_id=perm_map[perm.value].id,
                )
            )

    branch = Branch(
        name="Cafe Dx3 Main",
        code="DX3-01",
        address="12 MG Road",
        phone="+91-9876543210",
        email="hello@cafedx3.com",
        city="Bengaluru",
        state="KA",
        pincode="560001",
    )
    db.add(branch)
    db.flush()

    # Demo users (one per role)
    for role_enum in RoleEnum:
        db.add(
            User(
                email=f"{role_enum.value}@cafedx3.com",
                username=role_enum.value,
                full_name=f"Demo {role_enum.value.title()}",
                hashed_password=None,  # TODO: set when auth is implemented
                role_id=role_map[role_enum.value].id,
                branch_id=branch.id,
            )
        )

    # Tables 1-20
    for n in range(1, 21):
        status = "occupied" if n <= 5 else ("reserved" if n == 6 else "available")
        db.add(
            Table(
                number=n,
                name=f"Table {n}",
                capacity=2 if n <= 4 else (6 if n > 16 else 4),
                status=status,
                floor="Ground" if n <= 10 else "First",
                branch_id=branch.id,
            )
        )

    categories_data = [
        ("Coffee", "Hot and cold coffee beverages", 1),
        ("Tea", "Chai and specialty teas", 2),
        ("Pizza", "Wood-fired and classic pizzas", 3),
        ("Burger", "Gourmet burgers", 4),
        ("Desserts", "Sweet treats", 5),
        ("Juice", "Fresh juices and coolers", 6),
    ]
    category_ids = {}
    for name, desc, order in categories_data:
        cat = MenuCategory(name=name, description=desc, sort_order=order)
        db.add(cat)
        db.flush()
        category_ids[name] = cat.id

    menu_items = [
        ("Espresso", "Coffee", "30.00", True),
        ("Cappuccino", "Coffee", "120.00", True),
        ("Latte", "Coffee", "140.00", True),
        ("Cold Brew", "Coffee", "160.00", True),
        ("Masala Chai", "Tea", "40.00", True),
        ("Green Tea", "Tea", "80.00", True),
        ("Lemon Tea", "Tea", "70.00", True),
        ("Margherita Pizza", "Pizza", "299.00", True),
        ("Farmhouse Pizza", "Pizza", "399.00", True),
        ("Pepperoni Pizza", "Pizza", "449.00", False),
        ("Classic Burger", "Burger", "199.00", False),
        ("Veggie Burger", "Burger", "179.00", True),
        ("Chicken Burger", "Burger", "229.00", False),
        ("Chocolate Brownie", "Desserts", "149.00", True),
        ("Cheesecake", "Desserts", "189.00", True),
        ("Ice Cream Scoop", "Desserts", "99.00", True),
        ("Orange Juice", "Juice", "90.00", True),
        ("Watermelon Juice", "Juice", "90.00", True),
        ("Mixed Fruit Juice", "Juice", "120.00", True),
    ]
    item_objs = []
    for name, cat, price, veg in menu_items:
        mi = MenuItem(
            name=name,
            description=f"House special {name}",
            price=Decimal(price),
            category_id=category_ids[cat],
            is_veg=veg,
            is_available=True,
        )
        db.add(mi)
        db.flush()
        item_objs.append(mi)

    employees = [
        ("EMP001", "Anita Sharma", "captain", "9876500001"),
        ("EMP002", "Rahul Verma", "kitchen", "9876500002"),
        ("EMP003", "Priya Nair", "cashier", "9876500003"),
        ("EMP004", "Vikram Singh", "manager", "9876500004"),
        ("EMP005", "Sneha Patel", "captain", "9876500005"),
        ("EMP006", "Arjun Das", "kitchen", "9876500006"),
    ]
    for code, name, role, phone in employees:
        db.add(
            Employee(
                employee_code=code,
                full_name=name,
                phone=phone,
                email=f"{code.lower()}@cafedx3.com",
                role_name=role,
                status="active",
                join_date=datetime.now(timezone.utc),
                salary=Decimal("25000.00"),
                branch_id=branch.id,
            )
        )

    customers = [
        ("Asha Reddy", "9811100001", "asha@mail.com"),
        ("Karan Mehta", "9811100002", "karan@mail.com"),
        ("Neha Gupta", "9811100003", "neha@mail.com"),
        ("Rohit Joshi", "9811100004", "rohit@mail.com"),
        ("Meera Iyer", "9811100005", "meera@mail.com"),
    ]
    customer_objs = []
    for name, phone, email in customers:
        c = Customer(
            name=name,
            phone=phone,
            email=email,
            loyalty_points=50,
            visit_count=3,
        )
        db.add(c)
        db.flush()
        customer_objs.append(c)

    inventory = [
        ("SKU-COF-01", "Coffee Beans Arabica", "kg", "25", "5", "850"),
        ("SKU-MLK-01", "Full Cream Milk", "ltr", "40", "10", "60"),
        ("SKU-BRD-01", "Burger Buns", "pcs", "80", "20", "8"),
        ("SKU-CHS-01", "Mozzarella Cheese", "kg", "12", "3", "420"),
        ("SKU-VEG-01", "Tomatoes", "kg", "15", "5", "40"),
        ("SKU-TEA-01", "Assam Tea Leaves", "kg", "8", "2", "350"),
        ("SKU-SUG-01", "Sugar", "kg", "30", "10", "45"),
        ("SKU-OIL-01", "Cooking Oil", "ltr", "18", "5", "140"),
    ]
    for sku, name, unit, qty, reorder, cost in inventory:
        db.add(
            InventoryItem(
                sku=sku,
                name=name,
                unit=unit,
                quantity_on_hand=Decimal(qty),
                reorder_level=Decimal(reorder),
                unit_cost=Decimal(cost),
                category="raw",
                branch_id=branch.id,
            )
        )

    # Sample orders
    for i in range(1, 6):
        order = Order(
            order_number=f"ORD-{i:05d}",
            table_id=i,
            customer_id=customer_objs[(i - 1) % len(customer_objs)].id,
            status="preparing" if i <= 3 else "ready",
            order_type="dine_in",
            subtotal=Decimal("400.00"),
            tax_amount=Decimal("20.00"),
            total_amount=Decimal("420.00"),
            branch_id=branch.id,
            notes="Demo order",
        )
        db.add(order)
        db.flush()
        item = item_objs[i % len(item_objs)]
        db.add(
            OrderItem(
                order_id=order.id,
                menu_item_id=item.id,
                quantity=2,
                unit_price=item.price,
                tax_amount=Decimal("10.00"),
                total_price=item.price * 2,
                status="preparing",
                kot_sent=True,
            )
        )
        if i == 5:
            db.add(
                Payment(
                    payment_number="PAY-00001",
                    order_id=order.id,
                    amount=Decimal("420.00"),
                    method="upi",
                    status="completed",
                )
            )

    db.add_all(
        [
            Setting(key="cafe_name", value="Cafe Dx3", category="general", description="Display name"),
            Setting(key="tax_percent", value="5", category="billing", description="Default GST %"),
            Setting(key="currency", value="INR", category="billing"),
            Setting(key="kot_auto_print", value="true", category="kitchen"),
            Notification(
                title="Low stock alert",
                message="Mozzarella Cheese below reorder level",
                notification_type="warning",
                is_read=False,
                link="/inventory",
            ),
            Notification(
                title="New order",
                message="Order ORD-00003 sent to kitchen",
                notification_type="order",
                is_read=False,
                link="/kitchen/kot",
            ),
            Feedback(
                customer_id=customer_objs[0].id,
                rating=5,
                comment="Great cappuccino!",
                source="qr_menu",
                status="new",
            ),
            Feedback(
                customer_id=customer_objs[1].id,
                rating=4,
                comment="Pizza was tasty, service a bit slow",
                source="qr_menu",
                status="reviewed",
            ),
        ]
    )

    db.commit()
