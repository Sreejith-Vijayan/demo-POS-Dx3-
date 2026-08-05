from fastapi import APIRouter, Depends

from app.core.enums import PermissionEnum
from app.permissions import require_permissions
from app.services import CustomerService, get_customer_service

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("")
async def list_customers(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_CUSTOMERS)),
    service: CustomerService = Depends(get_customer_service),
):
    customers = service.list_customers()
    return {
        "items": [
            {
                "id": c.id,
                "name": c.name,
                "phone": c.phone,
                "email": c.email,
                "loyalty_points": c.loyalty_points,
                "visit_count": c.visit_count,
            }
            for c in customers
        ],
        "total": len(customers),
    }


@router.post("")
async def create_customer(
    _: object = Depends(require_permissions(PermissionEnum.MANAGE_CUSTOMERS)),
):
    return {"message": "Customer create stub"}
