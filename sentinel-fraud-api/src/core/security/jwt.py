from datetime import UTC, datetime, timedelta

from jose import jwt

SECRET_KEY = "super-secret-key"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30

REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_access_token(
    subject: str,
) -> str:
    expire = datetime.now(UTC) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES,
    )

    payload = {
        "sub": subject,
        "exp": expire,
        "type": "access",
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def create_refresh_token(
    subject: str,
) -> str:
    expire = datetime.now(UTC) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS,
    )

    payload = {
        "sub": subject,
        "exp": expire,
        "type": "refresh",
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
