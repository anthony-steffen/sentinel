"""update audit actions

Revision ID: a2b5cdc15043
Revises: bd4315180838
Create Date: 2026-05-21 23:35:42.699477

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a2b5cdc15043"

down_revision: Union[str, Sequence[str], None] = "bd4315180838"

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        ALTER TYPE auditaction ADD VALUE IF NOT EXISTS 'TRANSACTION_CREATED';
        """)

    op.execute("""
        ALTER TYPE auditaction ADD VALUE IF NOT EXISTS 'TRANSACTION_REVIEWED';
        """)

    op.execute("""
        ALTER TYPE auditaction ADD VALUE IF NOT EXISTS 'TRANSACTION_APPROVED';
        """)

    op.execute("""
        ALTER TYPE auditaction ADD VALUE IF NOT EXISTS 'TRANSACTION_REJECTED';
        """)


def downgrade() -> None:
    pass
