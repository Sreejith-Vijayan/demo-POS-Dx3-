"""Authorization dependencies and permission decorators."""

from typing import Callable, List, Optional

from fastapi import Depends, Header, HTTPException, status

from backend.app.config import get_settings
from backend.app.core.enums import PermissionEnum, RoleEnum
from backend.app.permissions.matrix import role_has_permission


class CurrentUserContext:
    """Demo user context derived from role header (JWT-ready shape)."""

    def __init__(
        self,
        role: RoleEnum,
        user_id: Optional[int] = None,
        username: Optional[str] = None,
    ):
        self.role = role
        self.user_id = user_id or 1
        self.username = username or f"demo_{role.value}"


def parse_role(role_value: Optional[str]) -> RoleEnum:
    """Parse and validate role string."""
    if not role_value:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Role header missing. Select a role on the frontend.",
        )
    try:
        return RoleEnum(role_value.lower().strip())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role: {role_value}",
        )


async def get_current_user(
    x_user_role: Optional[str] = Header(None, alias="X-User-Role"),
) -> CurrentUserContext:
    """
    Authorization dependency.

    TODO: Replace header-based demo auth with JWT Bearer token validation.
    """
    settings = get_settings()
    role = parse_role(x_user_role)
    return CurrentUserContext(role=role)


def require_permissions(*permissions: PermissionEnum) -> Callable:
    """
    Dependency factory: require ALL listed permissions.

    Usage:
        @router.get("/", dependencies=[Depends(require_permissions(PermissionEnum.VIEW_MENU))])
    """

    async def dependency(
        current_user: CurrentUserContext = Depends(get_current_user),
    ) -> CurrentUserContext:
        for perm in permissions:
            if not role_has_permission(current_user.role, perm):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail={
                        "message": "Not authorized",
                        "required_permission": perm.value,
                        "role": current_user.role.value,
                    },
                )
        return current_user

    return dependency


def require_any_permission(*permissions: PermissionEnum) -> Callable:
    """Dependency factory: require ANY of the listed permissions."""

    async def dependency(
        current_user: CurrentUserContext = Depends(get_current_user),
    ) -> CurrentUserContext:
        for perm in permissions:
            if role_has_permission(current_user.role, perm):
                return current_user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "message": "Not authorized",
                "required_any_of": [p.value for p in permissions],
                "role": current_user.role.value,
            },
        )

    return dependency


def require_roles(*roles: RoleEnum) -> Callable:
    """Dependency factory: require one of the listed roles."""

    async def dependency(
        current_user: CurrentUserContext = Depends(get_current_user),
    ) -> CurrentUserContext:
        if current_user.role not in roles and current_user.role != RoleEnum.ADMINISTRATOR:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "message": "Role not allowed",
                    "allowed_roles": [r.value for r in roles],
                    "role": current_user.role.value,
                },
            )
        return current_user

    return dependency
