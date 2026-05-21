from datetime import timedelta

from sqlalchemy import func
from sqlalchemy import select

from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.transactions.infrastructure.models.transaction_model import (
    TransactionModel,
)


class TransactionRepository:
    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

    async def create(
        self,
        transaction: TransactionModel,
    ) -> TransactionModel:
        self.session.add(
            transaction,
        )

        await self.session.commit()

        await self.session.refresh(
            transaction,
        )

        return transaction

    async def list_all(
        self,
    ) -> list[TransactionModel]:
        query = select(
            TransactionModel,
        )

        result = await self.session.execute(
            query,
        )

        return list(
            result.scalars().all(),
        )

    async def find_by_user_id(
        self,
        user_id,
    ) -> list[TransactionModel]:
        query = select(
            TransactionModel,
        ).where(
            TransactionModel.user_id == user_id,
        )

        result = await self.session.execute(
            query,
        )

        return list(
            result.scalars().all(),
        )

    async def count_recent_transactions(
        self,
        user_id,
        minutes: int = 5,
    ) -> int:
        query = select(
            func.count(
                TransactionModel.id,
            ),
        ).where(
            TransactionModel.user_id == user_id,
            TransactionModel.created_at
            >= (func.now() - timedelta(minutes=minutes)),  # noqa: E501
        )

        result = await self.session.execute(
            query,
        )

        return result.scalar() or 0
