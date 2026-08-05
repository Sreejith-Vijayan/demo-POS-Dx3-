from fastapi import APIRouter, Depends

from app.core.enums import PermissionEnum
from app.permissions import require_permissions
from app.schemas import DashboardStats
from app.services import DashboardService, get_dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardStats)
async def get_dashboard(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_DASHBOARD)),
    service: DashboardService = Depends(get_dashboard_service),
):
    return service.get_stats()


@router.get("/overview")
async def dashboard_overview(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_DASHBOARD)),
    service: DashboardService = Depends(get_dashboard_service),
):
    stats = service.get_stats()
    return {"overview": stats.model_dump(), "message": "Dashboard overview stub"}


@router.get("/sales")
async def dashboard_sales(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_SALES)),
):
    # TODO: Sales charts data
    return {
        "hourly": [1200, 800, 1500, 2200, 1800, 2400],
        "labels": ["10am", "11am", "12pm", "1pm", "2pm", "3pm"],
    }
