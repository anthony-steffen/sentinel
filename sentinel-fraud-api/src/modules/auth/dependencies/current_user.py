from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database.database import get_db

from src.core.security.jwt import decode_token

from src.modules.users.domain.enums.user_enums import (
    UserStatus,
)

from src.modules.users.infrastructure.repositories.user_repository import (
    UserRepository,
)

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security,
    ),
    db: AsyncSession = Depends(get_db),
):
    token = credentials.credentials

    try:
        payload = decode_token(
            token,
        )

        user_id = payload.get("sub")

        token_type = payload.get(
            "type",
        )

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

        if token_type != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type",
            )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    repository = UserRepository(db)

    user = await repository.find_by_id(
        user_id,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.status != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is inactive or blocked",
        )

    return user
