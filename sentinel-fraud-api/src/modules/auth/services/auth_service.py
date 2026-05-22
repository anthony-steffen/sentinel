from fastapi import HTTPException
from fastapi import Request

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security.jwt import (
    create_access_token,
    create_refresh_token,
    decode_token,
)

from src.core.security.password import (
    hash_password,
    verify_password,
)

from src.modules.audit.domain.enums.audit_action import (
    AuditAction,
)

from src.modules.audit.infrastructure.models.audit_model import (
    AuditModel,
)

from src.modules.audit.infrastructure.repositories.audit_repository import (
    AuditRepository,
)

from src.modules.auth.domain.schemas.auth_schema import (
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    TokenResponse,
)

from src.modules.users.domain.enums.user_enums import (
    UserStatus,
)

from src.modules.users.infrastructure.models.user_model import (
    UserModel,
)

from src.modules.users.infrastructure.repositories.user_repository import (
    UserRepository,
)


class AuthService:
    @staticmethod
    async def register(
        data: RegisterRequest,
        session: AsyncSession,
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

        user = await repository.create(
            user,
        )

        return {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
        }

    @staticmethod
    async def login(
        request: Request,
        data: LoginRequest,
        session: AsyncSession,
    ) -> TokenResponse:
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

    @staticmethod
    async def refresh_token(
        request: Request,
        data: RefreshTokenRequest,
        session: AsyncSession,
    ) -> TokenResponse:
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
