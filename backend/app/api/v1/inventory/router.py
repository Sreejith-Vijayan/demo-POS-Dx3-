from fastapi import APIRouter, Depends

from app.core.enums import PermissionEnum
from app.permissions import require_permissions
from app.services import InventoryService, get_inventory_service

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("")
async def list_inventory(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_INVENTORY)),
    service: InventoryService = Depends(get_inventory_service),
):
    items = service.list_items()
    return {
        "items": [
            {
                "id": i.id,
                "sku": i.sku,
                "name": i.name,
                "unit": i.unit,
                "quantity_on_hand": float(i.quantity_on_hand),
                "reorder_level": float(i.reorder_level),
                "unit_cost": float(i.unit_cost),
                "category": i.category,
            }
            for i in items
        ],
        "total": len(items),
    }


@router.post("")
async def create_inventory_item(
    _: object = Depends(require_permissions(PermissionEnum.MODIFY_INVENTORY)),
):
    # TODO: Create inventory item
    return {"message": "Inventory create stub"}


@router.put("/{item_id}")
async def update_inventory_item(
    item_id: int,
    _: object = Depends(require_permissions(PermissionEnum.MODIFY_INVENTORY)),
):
    # TODO: Update stock levels with transaction log
    return {"id": item_id, "message": "Inventory update stub"}
