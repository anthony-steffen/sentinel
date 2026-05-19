from uuid import UUID

from pydantic import BaseModel, EmailStr

from src.modules.users.domain.enums.user_enums import (
    UserRole,
    UserStatus,
)


class UserResponse(
    BaseModel,
):
    id: UUID
    email: EmailStr
    full_name: str
    role: UserRole
    status: UserStatus

    class Config:
        from_attributes = True


class UpdateUserRoleRequest(
    BaseModel,
):
    role: UserRole


class UpdateUserStatusRequest(
    BaseModel,
):
    status: UserStatus
