"""create blacklists table

Revision ID: bd4315180838
Revises: 70aca2d2f786
Create Date: 2026-05-21 16:26:27.718879

"""

from typing import Sequence, Union

from alembic import op

import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "bd4315180838"

down_revision: Union[str, Sequence[str], None] = "70aca2d2f786"

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "blacklists",
        sa.Column(
            "value",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "type",
            sa.Enum(
                "IP",
                "DEVICE",
                name="blacklisttype",
            ),
            nullable=False,
        ),
        sa.Column(
            "reason",
            sa.String(length=255),
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
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_blacklists_value",
        "blacklists",
        ["value"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_blacklists_value",
        table_name="blacklists",
    )

    op.drop_table("blacklists")
