from fastapi import APIRouter, Depends

from app.core.enums import PermissionEnum
from app.permissions import require_permissions
from app.schemas import PaymentCreate
from app.services import CashierService, get_cashier_service

router = APIRouter(prefix="/cashier", tags=["cashier"])


@router.get("/billing")
async def billing_queue(
    _: object = Depends(require_permissions(PermissionEnum.GENERATE_BILL)),
):
    # TODO: Orders ready for billing
    return {
        "items": [
            {"order_id": 1, "order_number": "ORD-00001", "table": "Table 5", "total": 850.0},
            {"order_id": 2, "order_number": "ORD-00002", "table": "Table 12", "total": 1240.0},
        ]
    }


@router.post("/payments")
async def create_payment(
    payload: PaymentCreate,
    _: object = Depends(require_permissions(PermissionEnum.RECEIVE_PAYMENT)),
    service: CashierService = Depends(get_cashier_service),
):
    return service.create_payment(payload)


@router.get("/payments")
async def list_payments(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_PAYMENTS)),
    service: CashierService = Depends(get_cashier_service),
):
    payments = service.list_payments()
    return {
        "items": [
            {
                "id": p.id,
                "payment_number": p.payment_number,
                "order_id": p.order_id,
                "amount": float(p.amount),
                "method": p.method,
                "status": p.status,
            }
            for p in payments
        ],
        "total": len(payments),
    }


@router.get("/history")
async def payment_history(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_PAYMENTS)),
):
    return {"items": [], "message": "Cashier history stub"}


@router.post("/receipt/{payment_id}")
async def print_receipt(
    payment_id: int,
    _: object = Depends(require_permissions(PermissionEnum.PRINT_RECEIPT)),
):
    # TODO: Integrate thermal printer / PDF receipt
    return {"payment_id": payment_id, "message": "Receipt print stub"}
