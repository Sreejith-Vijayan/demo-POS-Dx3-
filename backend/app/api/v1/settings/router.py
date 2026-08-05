from fastapi import APIRouter, Depends

from app.core.enums import PermissionEnum
from app.permissions import require_permissions
from app.schemas import FeedbackCreate
from app.services import (
    FeedbackService,
    NotificationService,
    SettingsService,
    get_feedback_service,
    get_notification_service,
    get_settings_service,
)

settings_router = APIRouter(prefix="/settings", tags=["settings"])
notifications_router = APIRouter(prefix="/notifications", tags=["notifications"])
feedback_router = APIRouter(prefix="/feedback", tags=["feedback"])
payments_router = APIRouter(prefix="/payments", tags=["payments"])


@settings_router.get("")
async def list_settings(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_SETTINGS)),
    service: SettingsService = Depends(get_settings_service),
):
    settings = service.list_settings()
    return {
        "items": [
            {
                "id": s.id,
                "key": s.key,
                "value": s.value,
                "category": s.category,
                "description": s.description,
            }
            for s in settings
        ],
        "total": len(settings),
    }


@settings_router.put("/{key}")
async def update_setting(
    key: str,
    _: object = Depends(require_permissions(PermissionEnum.MANAGE_SETTINGS)),
):
    return {"key": key, "message": "Settings update stub"}


@notifications_router.get("")
async def list_notifications(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_NOTIFICATIONS)),
    service: NotificationService = Depends(get_notification_service),
):
    notes = service.list_notifications()
    return {
        "items": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "notification_type": n.notification_type,
                "is_read": n.is_read,
                "link": n.link,
            }
            for n in notes
        ],
        "total": len(notes),
    }


@feedback_router.get("")
async def list_feedback(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_FEEDBACK)),
    service: FeedbackService = Depends(get_feedback_service),
):
    items = service.list_feedback()
    return {
        "items": [
            {
                "id": f.id,
                "rating": f.rating,
                "comment": f.comment,
                "source": f.source,
                "status": f.status,
            }
            for f in items
        ],
        "total": len(items),
    }


@feedback_router.post("")
async def submit_feedback(
    payload: FeedbackCreate,
    _: object = Depends(require_permissions(PermissionEnum.SUBMIT_FEEDBACK)),
    service: FeedbackService = Depends(get_feedback_service),
):
    return service.submit(payload)


@payments_router.post("")
async def create_payment_global(
    _: object = Depends(require_permissions(PermissionEnum.RECEIVE_PAYMENT)),
):
    """Alias matching /api/v1/payments from spec."""
    return {"message": "Use POST /api/v1/cashier/payments — stub"}
