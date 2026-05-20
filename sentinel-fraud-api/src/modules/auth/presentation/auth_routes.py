from fastapi import (  # type: ignore
    APIRouter,
    Depends,
    HTTPException,
    Request,
)

from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore

from src.core.database.database import get_db

from src.core.security.jwt import (
    create_access_token,
    create_refresh_token,
    decode_token,
)

from src.core.security.password import (
    hash_password,
    verify_password,
)

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

from src.modules.users.domain.enums.user_enums import (
    UserRole,
    UserStatus,
)

from src.modules.users.infrastructure.models.user_model import (
    UserModel,
)

from src.modules.users.infrastructure.repositories.user_repository import (
    UserRepository,
)

from src.modules.audit.infrastructure.models.audit_model import (
    AuditModel,
)

from src.modules.audit.infrastructure.repositories.audit_repository import (
    AuditRepository,
)

from src.modules.audit.domain.enums.audit_action import (
    AuditAction,
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
    repository = UserRepository(session)

    existing_user = await repository.find_by_email(
        data.email,
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists",
        )

    user = UserModel(
        email=data.email,
        password_hash=hash_password(
            data.password,
        ),
        full_name=data.full_name,
    )

    user = await repository.create(user)

    return {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
    }


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    request: Request,
    data: LoginRequest,
    session: AsyncSession = Depends(get_db),
):
    repository = UserRepository(session)

    audit_repository = AuditRepository(session)

    user = await repository.find_by_email(
        data.email,
    )

    if not user:
        await audit_repository.create(
            AuditModel(
                user_id=None,
                action=AuditAction.LOGIN_FAILED,
                ip_address=request.client.host,
            )
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if user.status != UserStatus.ACTIVE:
        await audit_repository.create(
            AuditModel(
                user_id=str(user.id),
                action=AuditAction.LOGIN_BLOCKED,
                ip_address=request.client.host,
            )
        )

        raise HTTPException(
            status_code=403,
            detail="User is inactive or blocked",
        )

    valid_password = verify_password(
        data.password,
        user.password_hash,
    )

    if not valid_password:
        await audit_repository.create(
            AuditModel(
                user_id=str(user.id),
                action=AuditAction.LOGIN_FAILED,
                ip_address=request.client.host,
            )
        )

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

    await audit_repository.create(
        AuditModel(
            user_id=str(user.id),
            action=AuditAction.LOGIN_SUCCESS,
            ip_address=request.client.host,
        )
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
    payload = decode_token(
        data.refresh_token,
    )

    token_type = payload.get("type")

    if token_type != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user_id = payload.get("sub")

    repository = UserRepository(session)

    audit_repository = AuditRepository(session)

    user = await repository.find_by_id(
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    if user.status != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=403,
            detail="User is inactive or blocked",
        )

    access_token = create_access_token(
        subject=str(user.id),
    )

    refresh_token = create_refresh_token(
        subject=str(user.id),
    )

    await audit_repository.create(
        AuditModel(
            user_id=str(user.id),
            action=AuditAction.REFRESH_TOKEN,
            ip_address=request.client.host,
        )
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )
