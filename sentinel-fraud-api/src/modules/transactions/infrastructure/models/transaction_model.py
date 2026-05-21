from decimal import Decimal
from uuid import UUID

from sqlalchemy import (
    Enum,
    ForeignKey,
    Numeric,
    String,
    Float,
    JSON,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from src.core.database.base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)

from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)

from src.modules.users.infrastructure.models.user_model import (  # noqa: F401
    UserModel,
)


class TransactionModel(
    Base,
    UUIDMixin,
    TimestampMixin,
):
    __tablename__ = "transactions"

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    ip_address: Mapped[str] = mapped_column(
        String(45),
        nullable=False,
    )

    device_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    risk_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0,
    )

    fraud_signals: Mapped[list[str]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    status: Mapped[TransactionStatus] = mapped_column(
        Enum(TransactionStatus),
        nullable=False,
        default=TransactionStatus.PENDING,
    )
