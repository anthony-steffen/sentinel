"""create transactions table

Revision ID: 9a6371095e8a
Revises: a5df384db892
Create Date: 2026-05-20 11:27:26.118880

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "9a6371095e8a"
down_revision: Union[str, Sequence[str], None] = "a5df384db892"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "transactions",
        sa.Column(
            "user_id",
            sa.UUID(),
            nullable=False,
        ),
        sa.Column(
            "amount",
            sa.Numeric(
                precision=12,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "ip_address",
            sa.String(length=45),
            nullable=False,
        ),
        sa.Column(
            "device_id",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "risk_score",
            sa.Float(),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.Enum(
                "PENDING",
                "APPROVED",
                "REJECTED",
                "REVIEW",
                name="transactionstatus",
            ),
            nullable=False,
        ),
        sa.Column(
            "id",
            sa.UUID(),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_transactions_user_id"),
        "transactions",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f("ix_transactions_user_id"),
        table_name="transactions",
    )

    op.drop_table("transactions")
