from fastapi import APIRouter, Depends

from app.core.enums import PermissionEnum
from app.permissions import require_permissions
from app.schemas import OrderCreate, OrderOut
from app.services import CaptainService, OrderService, get_captain_service, get_order_service

router = APIRouter(prefix="/captain", tags=["captain"])


@router.get("/tables")
async def list_tables(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_TABLES)),
    service: CaptainService = Depends(get_captain_service),
):
    tables = service.list_tables()
    return {
        "items": [
            {
                "id": t.id,
                "number": t.number,
                "name": t.name,
                "capacity": t.capacity,
                "status": t.status,
                "floor": t.floor,
            }
            for t in tables
        ],
        "total": len(tables),
    }


@router.get("/orders")
async def captain_orders(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_ORDERS)),
    service: CaptainService = Depends(get_captain_service),
):
    orders = service.list_captain_orders()
    return {
        "items": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "table_id": o.table_id,
                "status": o.status,
                "total_amount": float(o.total_amount),
            }
            for o in orders
        ],
        "total": len(orders),
    }


@router.post("/orders")
async def take_order(
    payload: OrderCreate,
    _: object = Depends(require_permissions(PermissionEnum.TAKE_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    return service.create_order(payload)


@router.post("/kot/{order_id}")
async def send_kot(
    order_id: int,
    _: object = Depends(require_permissions(PermissionEnum.SEND_KOT)),
):
    # TODO: Mark items as KOT sent and push to kitchen display
    return {"order_id": order_id, "message": "KOT sent (stub)"}
