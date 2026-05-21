from sqlalchemy import (
    Enum,
    String,
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

from src.modules.transactions.domain.enums.blacklist_type_enums import (
    BlacklistType,
)


class BlacklistModel(
    Base,
    UUIDMixin,
    TimestampMixin,
):
    __tablename__ = "blacklists"

    value: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )

    type: Mapped[BlacklistType] = mapped_column(
        Enum(BlacklistType),
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
