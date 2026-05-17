from fastapi import (
    Depends,
    HTTPException,
    status,
)

from src.core.security.jwt import (
    decode_token,
    oauth2_scheme,
)

from src.modules.auth.data.fake_users_db import (
    fake_users_db,
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
):
    payload = decode_token(token)

    user_id = payload.get("sub")

    token_type = payload.get("type")

    if token_type != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    user = next(
        (user for user in fake_users_db if user["id"] == user_id),
        None,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user
