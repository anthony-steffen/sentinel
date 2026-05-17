from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from src.core.security.jwt import (
    create_access_token,
    create_refresh_token,
)

from src.core.security.password import (
    hash_password,
    verify_password,
)

from src.modules.auth.data.fake_users_db import (
    fake_users_db,
)

from src.modules.auth.dependencies.current_user import (
    get_current_user,
)

from src.modules.auth.domain.schemas.auth_schema import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
async def register(
    data: RegisterRequest,
):
    existing_user = next(
        (user for user in fake_users_db if user["email"] == data.email),
        None,
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )

    user = {
        "id": str(uuid4()),
        "email": data.email,
        "password_hash": hash_password(
            data.password,
        ),
    }

    fake_users_db.append(user)

    return {
        "id": user["id"],
        "email": user["email"],
    }


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    data: LoginRequest,
):
    user = next(
        (user for user in fake_users_db if user["email"] == data.email),
        None,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    valid_password = verify_password(
        data.password,
        user["password_hash"],
    )

    if not valid_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(
        subject=user["id"],
    )

    refresh_token = create_refresh_token(
        subject=user["id"],
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
        "id": current_user["id"],
        "email": current_user["email"],
    }
