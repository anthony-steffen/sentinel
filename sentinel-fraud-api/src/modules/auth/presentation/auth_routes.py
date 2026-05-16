from uuid import uuid4

from fastapi import APIRouter, HTTPException

from src.core.security.jwt import (
    create_access_token,
    create_refresh_token,
)

from src.core.security.password import (
    hash_password,
    verify_password,
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

fake_users_db = []


@router.post("/register")
async def register(
    data: RegisterRequest,
):
    print("REGISTER START")

    existing_user = next(
        (user for user in fake_users_db if user["email"] == data.email),
        None,
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
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
            status_code=401,
            detail="Invalid credentials",
        )

    valid_password = verify_password(
        data.password,
        user["password_hash"],
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
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
