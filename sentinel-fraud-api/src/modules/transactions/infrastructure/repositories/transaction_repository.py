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
        self.session.add(transaction)

        await self.session.commit()

        await self.session.refresh(transaction)

        return transaction

    async def list_all(
        self,
    ) -> list[TransactionModel]:
        query = select(TransactionModel)

        result = await self.session.execute(query)

        return list(result.scalars().all())
