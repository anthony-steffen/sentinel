from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status

from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, jwt

SECRET_KEY = "super-secret-key"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30

REFRESH_TOKEN_EXPIRE_DAYS = 7


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
)


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


def decode_token(
    token: str,
) -> dict:
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
