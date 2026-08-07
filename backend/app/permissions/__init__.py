from backend.app.permissions.deps import (
    CurrentUserContext,
    get_current_user,
    require_any_permission,
    require_permissions,
    require_roles,
)
from backend.app.permissions.matrix import (
    ROLE_PERMISSIONS,
    get_permissions_for_role,
    role_has_permission,
)

__all__ = [
    "CurrentUserContext",
    "get_current_user",
    "require_permissions",
    "require_any_permission",
    "require_roles",
    "ROLE_PERMISSIONS",
    "get_permissions_for_role",
    "role_has_permission",
]
