from fastapi import APIRouter, Depends

from app.core.enums import PermissionEnum
from app.permissions import require_permissions
from app.schemas import ReportSalesOut
from app.services import ReportService, get_report_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/sales", response_model=ReportSalesOut)
async def sales_report(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_REPORTS)),
    service: ReportService = Depends(get_report_service),
):
    return service.sales_report()


@router.get("/inventory")
async def inventory_report(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_REPORTS)),
):
    return {"message": "Inventory report stub", "low_stock": []}


@router.get("/employees")
async def employee_report(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_REPORTS)),
):
    return {"message": "Employee report stub"}
