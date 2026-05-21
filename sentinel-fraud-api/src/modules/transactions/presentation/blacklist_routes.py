from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database.database import get_db

from src.modules.auth.dependencies.roles import (
    require_roles,
)

from src.modules.transactions.domain.schemas.blacklist_schema import (
    BlacklistResponse,
    CreateBlacklistRequest,
)

from src.modules.transactions.infrastructure.models.blacklist_model import (
    BlacklistModel,
)

from src.modules.transactions.infrastructure.repositories.blacklist_repository import (
    BlacklistRepository,
)

from src.modules.users.domain.enums.user_enums import (
    UserRole,
)

router = APIRouter(
    prefix="/blacklists",
    tags=["Blacklists"],
)


@router.post(
    "/",
    response_model=BlacklistResponse,
)
async def create_blacklist(
    data: CreateBlacklistRequest,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMIN),
    ),
):
    repository = BlacklistRepository(session)

    existing = await repository.find_by_value(
        data.value,
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Value already blacklisted",
        )

    blacklist = BlacklistModel(
        value=data.value,
        type=data.type,
        reason=data.reason,
    )

    blacklist = await repository.create(
        blacklist,
    )

    return blacklist


@router.get(
    "/",
    response_model=list[BlacklistResponse],
)
async def list_blacklists(
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ANALYST,
        ),
    ),
):
    repository = BlacklistRepository(session)

    blacklists = await repository.list_all()

    return blacklists
