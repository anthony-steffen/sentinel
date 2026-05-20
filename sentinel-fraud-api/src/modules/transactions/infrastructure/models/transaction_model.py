from sqlalchemy import Enum, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column
from src.core.database.base import (
    Base,
    TimestampMixin,
    UUIDMixin,
)

from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)


class TransactionModel(
    Base,
    UUIDMixin,
    TimestampMixin,
):
    __tablename__ = "transactions"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    amount: Mapped[float] = mapped_column(
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
        default=0,
        nullable=False,
    )

    status: Mapped[TransactionStatus] = mapped_column(
        Enum(TransactionStatus),
        default=TransactionStatus.PENDING,
        nullable=False,
    )
