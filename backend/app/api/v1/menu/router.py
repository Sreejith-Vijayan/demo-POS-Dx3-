from typing import Optional

from fastapi import APIRouter, Depends

from app.core.enums import PermissionEnum
from app.permissions import require_permissions
from app.schemas import MenuItemCreate, OrderCancelItem, OrderCreate, OrderUpdate
from app.services import MenuService, OrderService, get_menu_service, get_order_service

router = APIRouter(prefix="/menu", tags=["menu"])


@router.get("")
async def list_menu(
    category_id: Optional[int] = None,
    _: object = Depends(require_permissions(PermissionEnum.VIEW_MENU)),
    service: MenuService = Depends(get_menu_service),
):
    items = service.list_items(category_id)
    return {
        "items": [
            {
                "id": i.id,
                "name": i.name,
                "description": i.description,
                "price": float(i.price),
                "category_id": i.category_id,
                "is_veg": i.is_veg,
                "is_available": i.is_available,
            }
            for i in items
        ],
        "total": len(items),
    }


@router.get("/categories")
async def list_categories(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_MENU)),
    service: MenuService = Depends(get_menu_service),
):
    cats = service.list_categories()
    return {
        "items": [
            {
                "id": c.id,
                "name": c.name,
                "description": c.description,
                "sort_order": c.sort_order,
            }
            for c in cats
        ],
        "total": len(cats),
    }


@router.get("/items/{item_id}")
async def get_menu_item(
    item_id: int,
    _: object = Depends(require_permissions(PermissionEnum.VIEW_MENU)),
    service: MenuService = Depends(get_menu_service),
):
    item = service.get_item(item_id)
    if not item:
        return {"detail": "Not found", "id": item_id}
    return {
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "price": float(item.price),
        "category_id": item.category_id,
        "is_veg": item.is_veg,
        "is_available": item.is_available,
    }


@router.post("/items")
async def create_menu_item(
    payload: MenuItemCreate,
    _: object = Depends(require_permissions(PermissionEnum.MANAGE_MENU)),
):
    # TODO: Persist menu item
    return {"message": "Menu item create stub", "payload": payload.model_dump()}


orders_router = APIRouter(prefix="/orders", tags=["orders"])


@orders_router.get("")
async def list_orders(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    orders = service.list_orders()
    return {
        "items": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "status": o.status,
                "total_amount": float(o.total_amount),
                "table_id": o.table_id,
            }
            for o in orders
        ],
        "total": len(orders),
    }


@orders_router.post("")
async def create_order(
    payload: OrderCreate,
    _: object = Depends(require_permissions(PermissionEnum.TAKE_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    return service.create_order(payload)


@orders_router.put("/{order_id}")
async def update_order(
    order_id: int,
    payload: OrderUpdate,
    _: object = Depends(require_permissions(PermissionEnum.MODIFY_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    return service.update_order(order_id, payload)


@orders_router.post("/{order_id}/hold")
async def hold_order(
    order_id: int,
    _: object = Depends(require_permissions(PermissionEnum.MODIFY_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    return service.hold_order(order_id)


@orders_router.post("/{order_id}/resume")
async def resume_order(
    order_id: int,
    _: object = Depends(require_permissions(PermissionEnum.MODIFY_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    return service.resume_order(order_id)


@orders_router.post("/{order_id}/send-kot")
async def send_order_to_kitchen(
    order_id: int,
    _: object = Depends(require_permissions(PermissionEnum.SEND_KOT)),
    service: OrderService = Depends(get_order_service),
):
    return service.send_kot(order_id)


@orders_router.post("/{order_id}/cancel-item")
async def cancel_order_item(
    order_id: int,
    payload: OrderCancelItem,
    _: object = Depends(require_permissions(PermissionEnum.CANCEL_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    return service.cancel_order_item(order_id, payload.order_item_id, payload.reason)


@orders_router.get("/{order_id}/status")
async def order_status(
    order_id: int,
    _: object = Depends(require_permissions(PermissionEnum.VIEW_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    return service.get_order_status(order_id)


@orders_router.get("/table/{table_id}")
async def orders_by_table(
    table_id: int,
    _: object = Depends(require_permissions(PermissionEnum.VIEW_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    orders = service.get_orders_by_table(table_id)
    return {
        "items": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "status": o.status,
                "table_id": o.table_id,
                "total_amount": float(o.total_amount),
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in orders
        ],
        "total": len(orders),
    }


@orders_router.get("/history/{table_id}")
async def order_history_by_table(
    table_id: int,
    _: object = Depends(require_permissions(PermissionEnum.VIEW_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    orders = service.get_order_history(table_id)
    return {
        "items": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "status": o.status,
                "table_id": o.table_id,
                "total_amount": float(o.total_amount),
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in orders
        ],
        "total": len(orders),
    }


@orders_router.delete("/{order_id}")
async def delete_order(
    order_id: int,
    _: object = Depends(require_permissions(PermissionEnum.CANCEL_ORDERS)),
    service: OrderService = Depends(get_order_service),
):
    return service.delete_order(order_id)
