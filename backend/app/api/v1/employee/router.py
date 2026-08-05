from fastapi import APIRouter, Depends

from app.core.enums import PermissionEnum
from app.permissions import require_permissions
from app.services import EmployeeService, get_employee_service

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("")
async def list_employees(
    _: object = Depends(require_permissions(PermissionEnum.VIEW_EMPLOYEES)),
    service: EmployeeService = Depends(get_employee_service),
):
    employees = service.list_employees()
    return {
        "items": [
            {
                "id": e.id,
                "employee_code": e.employee_code,
                "full_name": e.full_name,
                "role_name": e.role_name,
                "status": e.status,
                "phone": e.phone,
                "email": e.email,
            }
            for e in employees
        ],
        "total": len(employees),
    }


@router.post("")
async def create_employee(
    _: object = Depends(require_permissions(PermissionEnum.MANAGE_EMPLOYEES)),
):
    return {"message": "Employee create stub"}
