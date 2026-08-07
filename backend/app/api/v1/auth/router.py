"""Auth router — JWT-ready placeholders (no login implementation)."""

from fastapi import APIRouter, Depends

from backend.app.core.enums import RoleEnum
from backend.app.permissions import CurrentUserContext, get_current_user, get_permissions_for_role
from backend.app.schemas import MessageResponse, RoleInfo

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=RoleInfo)
async def get_me(current_user: CurrentUserContext = Depends(get_current_user)):
    """Return current demo role and effective permissions."""
    perms = get_permissions_for_role(current_user.role)
    return RoleInfo(role=current_user.role.value, permissions=[p.value for p in perms])


@router.get("/roles")
async def list_roles():
    """List available roles for the role-selection screen."""
    return {
        "roles": [
            {"value": r.value, "label": r.value.replace("_", " ").title()}
            for r in RoleEnum
        ]
    }


@router.post("/login", response_model=MessageResponse)
async def login_stub():
    # TODO: Implement JWT login
    return MessageResponse(message="Login not implemented — use role selection demo flow")


@router.post("/logout", response_model=MessageResponse)
async def logout_stub():
    # TODO: Implement token blacklist / logout
    return MessageResponse(message="Logout stub — clear role on client")
