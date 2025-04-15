"""creates all

Revision ID: f504e2265e75
Revises: ad99af547a53
Create Date: 2025-04-10 21:50:54.084396

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f504e2265e75'
down_revision: Union[str, None] = 'ad99af547a53'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
