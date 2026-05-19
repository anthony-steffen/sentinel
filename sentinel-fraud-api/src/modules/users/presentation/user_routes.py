from uuid import UUID

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

from src.modules.users.domain.enums.user_enums import (
    UserRole,
)

from src.modules.users.domain.schemas.user_schema import (
    UserResponse,
    UpdateUserRoleRequest,
    UpdateUserStatusRequest,
)

from src.modules.users.infrastructure.repositories.user_repository import (
    UserRepository,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/",
    response_model=list[UserResponse],
)
async def list_users(
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMIN),
    ),
):
    repository = UserRepository(session)

    users = await repository.find_all()

    return users


@router.patch(
    "/{user_id}/role",
    response_model=UserResponse,
)
async def update_user_role(
    user_id: UUID,
    data: UpdateUserRoleRequest,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMIN),
    ),
):
    repository = UserRepository(session)

    user = await repository.find_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    user.role = data.role

    updated_user = await repository.update(user)

    return updated_user


@router.patch(
    "/{user_id}/status",
    response_model=UserResponse,
)
async def update_user_status(
    user_id: UUID,
    data: UpdateUserStatusRequest,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(UserRole.ADMIN),
    ),
):
    repository = UserRepository(session)

    user = await repository.find_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    user.status = data.status

    updated_user = await repository.update(user)

    return updated_user
