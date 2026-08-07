"""Role-permission matrix and RBAC helpers."""

from typing import Dict, Set

from backend.app.core.enums import PermissionEnum, RoleEnum

# Permission sets per role
ROLE_PERMISSIONS: Dict[RoleEnum, Set[PermissionEnum]] = {
    RoleEnum.ADMINISTRATOR: {PermissionEnum.FULL_ACCESS},
    RoleEnum.MANAGER: {
        PermissionEnum.VIEW_DASHBOARD,
        PermissionEnum.VIEW_SALES,
        PermissionEnum.VIEW_ORDERS,
        PermissionEnum.VIEW_KOT,
        PermissionEnum.VIEW_INVENTORY,
        PermissionEnum.MODIFY_INVENTORY,
        PermissionEnum.VIEW_REPORTS,
        PermissionEnum.VIEW_EMPLOYEES,
        PermissionEnum.MANAGE_EMPLOYEES,
        PermissionEnum.VIEW_CUSTOMERS,
        PermissionEnum.MANAGE_CUSTOMERS,
        PermissionEnum.VIEW_MENU,
        PermissionEnum.MANAGE_MENU,
        PermissionEnum.VIEW_SETTINGS,
        PermissionEnum.VIEW_NOTIFICATIONS,
        PermissionEnum.VIEW_FEEDBACK,
        PermissionEnum.VIEW_TABLES,
        PermissionEnum.VIEW_PAYMENTS,
    },
    RoleEnum.CAPTAIN: {
        PermissionEnum.VIEW_DASHBOARD,
        PermissionEnum.TAKE_ORDERS,
        PermissionEnum.MODIFY_ORDERS,
        PermissionEnum.VIEW_ORDERS,
        PermissionEnum.SEND_KOT,
        PermissionEnum.CANCEL_ORDERS,
        PermissionEnum.VIEW_MENU,
        PermissionEnum.VIEW_TABLES,
        PermissionEnum.MANAGE_TABLES,
        PermissionEnum.VIEW_NOTIFICATIONS,
    },
    RoleEnum.KITCHEN: {
        PermissionEnum.VIEW_DASHBOARD,
        PermissionEnum.VIEW_KOT,
        PermissionEnum.UPDATE_KOT_STATUS,
        PermissionEnum.VIEW_ORDERS,
        PermissionEnum.VIEW_NOTIFICATIONS,
    },
    RoleEnum.CASHIER: {
        PermissionEnum.VIEW_DASHBOARD,
        PermissionEnum.VIEW_ORDERS,
        PermissionEnum.GENERATE_BILL,
        PermissionEnum.RECEIVE_PAYMENT,
        PermissionEnum.PRINT_RECEIPT,
        PermissionEnum.VIEW_PAYMENTS,
        PermissionEnum.VIEW_MENU,
        PermissionEnum.VIEW_CUSTOMERS,
        PermissionEnum.VIEW_NOTIFICATIONS,
        PermissionEnum.VIEW_TABLES,
    },
    RoleEnum.CUSTOMER: {
        PermissionEnum.VIEW_MENU,
        PermissionEnum.SUBMIT_FEEDBACK,
        PermissionEnum.VIEW_FEEDBACK,
    },
}


def role_has_permission(role: RoleEnum, permission: PermissionEnum) -> bool:
    """Check whether a role grants a permission (FULL_ACCESS implies all)."""
    perms = ROLE_PERMISSIONS.get(role, set())
    if PermissionEnum.FULL_ACCESS in perms:
        return True
    return permission in perms


def get_permissions_for_role(role: RoleEnum) -> Set[PermissionEnum]:
    """Return effective permissions for a role."""
    perms = ROLE_PERMISSIONS.get(role, set())
    if PermissionEnum.FULL_ACCESS in perms:
        return set(PermissionEnum)
    return perms
