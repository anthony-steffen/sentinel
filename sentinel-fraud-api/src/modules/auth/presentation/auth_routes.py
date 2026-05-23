from fastapi import (  # type: ignore
    APIRouter,
    Depends,
    Request,
)

from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore

from src.core.database.database import get_db

from src.modules.auth.dependencies.current_user import (
    get_current_user,
)

from src.modules.auth.dependencies.roles import (
    require_roles,
)

from src.modules.auth.domain.schemas.auth_schema import (
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    TokenResponse,
)

from src.modules.auth.services.auth_service import (
    AuthService,
)

from src.modules.users.domain.enums.user_enums import (
    UserRole,
)

from src.core.security.rate_limit.rate_limiter import (
    RateLimiter,
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.get("/admin-only")
async def admin_only(
    current_user=Depends(
        require_roles(UserRole.ADMIN),
    ),
):
    return {
        "message": "Welcome admin",
        "user": current_user.email,
    }


@router.post("/register")
async def register(
    data: RegisterRequest,
    session: AsyncSession = Depends(get_db),
):
    return await AuthService.register(
        data=data,
        session=session,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    request: Request,
    data: LoginRequest,
    session: AsyncSession = Depends(get_db),
):
    await RateLimiter.check_login_rate_limit(
        request.client.host,
    )
    return await AuthService.login(
        request=request,
        data=data,
        session=session,
    )


@router.get("/me")
async def me(
    current_user=Depends(get_current_user),
):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "status": current_user.status,
    }


@router.post(
    "/refresh",
    response_model=TokenResponse,
)
async def refresh_token(
    request: Request,
    data: RefreshTokenRequest,
    session: AsyncSession = Depends(get_db),
):
    return await AuthService.refresh_token(
        request=request,
        data=data,
        session=session,
    )
