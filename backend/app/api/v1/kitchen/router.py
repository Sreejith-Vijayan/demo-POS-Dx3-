from fastapi import APIRouter, Depends

from app.core.enums import PermissionEnum
from app.permissions import require_permissions
from app.schemas import KitchenStatusUpdate
from app.services import KitchenService, get_kitchen_service

router = APIRouter(prefix="/kitchen", tags=["kitchen"])


@router.get("/orders")
async def kitchen_orders(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_KOT)),
    service: KitchenService = Depends(get_kitchen_service),
):
    orders = service.list_kitchen_orders()
    return {
        "items": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "table_id": o.table_id,
                "status": o.status,
                "notes": o.notes,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in orders
        ],
        "total": len(orders),
    }


@router.put("/status/{order_id}")
async def update_kot_status(
    order_id: int,
    payload: KitchenStatusUpdate,
    _: object = Depends(require_permissions(PermissionEnum.UPDATE_KOT_STATUS)),
    service: KitchenService = Depends(get_kitchen_service),
):
    return service.update_status(order_id, payload.status)


@router.get("/history")
async def kitchen_history(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_KOT)),
):
    # TODO: Completed KOT history
    return {"items": [], "message": "Kitchen history stub"}
