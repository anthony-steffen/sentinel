from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database.database import get_db

from src.modules.auth.dependencies.roles import (
    require_roles,
)

from src.modules.dashboard.domain.schemas.dashboard_schema import (
    DashboardSummaryResponse,
)

from src.modules.dashboard.services.dashboard_service import (
    DashboardService,
)

from src.modules.transactions.infrastructure.repositories.transaction_repository import (  # noqa: E501
    TransactionRepository,
)

from src.modules.users.domain.enums.user_enums import (
    UserRole,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
)
async def dashboard_summary(
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ANALYST,
            UserRole.OPERATOR,
        ),
    ),
):
    repository = TransactionRepository(session)

    transactions = await repository.list_all()

    return DashboardService.build_summary(
        transactions,
    )
