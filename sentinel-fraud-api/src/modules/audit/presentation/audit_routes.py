from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database.database import get_db

from src.modules.auth.dependencies.roles import (
    require_roles,
)

from src.modules.audit.domain.schemas.audit_schema import (
    AuditResponse,
)

from src.modules.audit.infrastructure.repositories.audit_repository import (
    AuditRepository,
)

from src.modules.users.domain.enums.user_enums import (
    UserRole,
)

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"],
)


@router.get(
    "/",
    response_model=list[AuditResponse],
)
async def list_audit_logs(
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ANALYST,
        ),
    ),
):
    repository = AuditRepository(session)

    logs = await repository.list_all()

    return logs
