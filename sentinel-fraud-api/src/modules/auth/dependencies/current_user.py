from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer

from jose import JWTError
from jose import jwt

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database.database import get_db

from src.core.security.jwt import ALGORITHM
from src.core.security.jwt import SECRET_KEY

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
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

    except JWTError:
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

    return user
