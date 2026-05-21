"""add fraud signals to transactions

Revision ID: 70aca2d2f786
Revises: 9a6371095e8a
Create Date: 2026-05-21 10:59:26.802081

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "70aca2d2f786"

down_revision: Union[str, Sequence[str], None] = "9a6371095e8a"

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "transactions",
        sa.Column(
            "fraud_signals",
            sa.JSON(),
            nullable=False,
            server_default="[]",
        ),
    )


def downgrade() -> None:
    op.drop_column(
        "transactions",
        "fraud_signals",
    )
