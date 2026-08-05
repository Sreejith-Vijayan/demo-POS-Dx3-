"""API v1 router aggregation."""

from fastapi import APIRouter

from app.api.v1.auth.router import router as auth_router
from app.api.v1.captain.router import router as captain_router
from app.api.v1.cashier.router import router as cashier_router
from app.api.v1.customer.router import router as customer_router
from app.api.v1.dashboard.router import router as dashboard_router
from app.api.v1.employee.router import router as employee_router
from app.api.v1.inventory.router import router as inventory_router
from app.api.v1.kitchen.router import router as kitchen_router
from app.api.v1.menu.router import orders_router, router as menu_router
from app.api.v1.reports.router import router as reports_router
from app.api.v1.settings.router import (
    feedback_router,
    notifications_router,
    payments_router,
    settings_router,
)

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(captain_router)
api_router.include_router(cashier_router)
api_router.include_router(kitchen_router)
api_router.include_router(menu_router)
api_router.include_router(orders_router)
api_router.include_router(inventory_router)
api_router.include_router(reports_router)
api_router.include_router(employee_router)
api_router.include_router(customer_router)
api_router.include_router(settings_router)
api_router.include_router(notifications_router)
api_router.include_router(feedback_router)
api_router.include_router(payments_router)
