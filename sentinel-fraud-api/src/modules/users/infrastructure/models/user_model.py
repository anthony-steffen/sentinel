from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


from src.core.database.base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)

from src.modules.users.domain.enums.user_enums import (
    UserRole,
    UserStatus,
)


class UserModel(
    Base,
    UUIDMixin,
    TimestampMixin,
):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        default=UserRole.OPERATOR,
        nullable=False,
    )

    status: Mapped[UserStatus] = mapped_column(
        Enum(UserStatus),
        default=UserStatus.ACTIVE,
        nullable=False,
    )
