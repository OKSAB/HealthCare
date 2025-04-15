"""creates all models

Revision ID: ad99af547a53
Revises: c804b369372f
Create Date: 2025-04-10 21:40:48.144914

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ad99af547a53'
down_revision: Union[str, None] = 'c804b369372f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
