"""add role and status to users

Revision ID: 269d5d88798e
Revises: 0255166b9797
Create Date: 2026-05-18 19:31:33.249419

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "269d5d88798e"
down_revision: Union[str, Sequence[str], None] = "0255166b9797"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    user_role_enum = sa.Enum(
        "ADMIN",
        "ANALYST",
        "OPERATOR",
        name="userrole",
    )

    user_status_enum = sa.Enum(
        "ACTIVE",
        "INACTIVE",
        "BLOCKED",
        name="userstatus",
    )

    user_role_enum.create(
        op.get_bind(),
        checkfirst=True,
    )

    user_status_enum.create(
        op.get_bind(),
        checkfirst=True,
    )

    op.add_column(
        "users",
        sa.Column(
            "role",
            user_role_enum,
            nullable=False,
            server_default="OPERATOR",
        ),
    )

    op.add_column(
        "users",
        sa.Column(
            "status",
            user_status_enum,
            nullable=False,
            server_default="ACTIVE",
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("users", "status")

    op.drop_column("users", "role")

    sa.Enum(
        "ACTIVE",
        "INACTIVE",
        "BLOCKED",
        name="userstatus",
    ).drop(
        op.get_bind(),
        checkfirst=True,
    )

    sa.Enum(
        "ADMIN",
        "ANALYST",
        "OPERATOR",
        name="userrole",
    ).drop(
        op.get_bind(),
        checkfirst=True,
    )
