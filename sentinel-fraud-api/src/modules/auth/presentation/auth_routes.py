from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database.database import get_db

from src.core.security.jwt import (
    create_access_token,
    create_refresh_token,
)

from src.core.security.password import (
    hash_password,
    verify_password,
)

from src.modules.auth.dependencies.current_user import (
    get_current_user,
)

from src.modules.auth.domain.schemas.auth_schema import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)

from src.modules.users.infrastructure.repositories.user_repository import (
    UserRepository,
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/register")
async def register(
    data: RegisterRequest,
    session: AsyncSession = Depends(get_db),
):
    repository = UserRepository(session)

    existing_user = await repository.find_by_email(
        data.email,
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists",
        )

    user = await repository.create(
        email=data.email,
        password_hash=hash_password(
            data.password,
        ),
        full_name=data.full_name,
    )

    return {
        "id": str(user.id),
        "email": user.email,
    }


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    data: LoginRequest,
    session: AsyncSession = Depends(get_db),
):
    repository = UserRepository(session)

    user = await repository.find_by_email(
        data.email,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    valid_password = verify_password(
        data.password,
        user.password_hash,
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    access_token = create_access_token(
        subject=str(user.id),
    )

    refresh_token = create_refresh_token(
        subject=str(user.id),
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.get("/me")
async def me(
    current_user=Depends(get_current_user),
):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
    }
