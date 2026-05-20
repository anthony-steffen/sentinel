from sqlalchemy import Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from src.core.database.base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)

from src.modules.audit.domain.enums.audit_action import (
    AuditAction,
)


class AuditModel(
    Base,
    UUIDMixin,
    TimestampMixin,
):
    __tablename__ = "audit_logs"

    user_id: Mapped[str | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    action: Mapped[AuditAction] = mapped_column(
        Enum(AuditAction),
        nullable=False,
    )

    ip_address: Mapped[str] = mapped_column(
        String(45),
        nullable=False,
    )
