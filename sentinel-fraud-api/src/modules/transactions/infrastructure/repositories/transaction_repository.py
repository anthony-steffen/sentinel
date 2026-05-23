from datetime import timedelta

from sqlalchemy import desc
from sqlalchemy import func
from sqlalchemy import or_
from sqlalchemy import select

from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)

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

    async def find_by_id(
        self,
        transaction_id,
    ) -> TransactionModel | None:
        query = select(
            TransactionModel,
        ).where(
            TransactionModel.id == transaction_id,
        )

        result = await self.session.execute(
            query,
        )

        return result.scalar_one_or_none()

    async def update(
        self,
        transaction: TransactionModel,
    ) -> TransactionModel:
        await self.session.commit()

        await self.session.refresh(
            transaction,
        )

        return transaction

    async def get_review_queue(
        self,
    ) -> list[TransactionModel]:
        query = (
            select(
                TransactionModel,
            )
            .where(
                or_(
                    TransactionModel.status == TransactionStatus.REVIEW,
                    TransactionModel.status == TransactionStatus.REJECTED,
                )
            )
            .order_by(
                desc(
                    TransactionModel.risk_score,
                )
            )
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

    async def count_transactions_by_device(
        self,
        device_id: str,
    ) -> int:
        query = select(
            func.count(
                TransactionModel.id,
            ),
        ).where(
            TransactionModel.device_id == device_id,
        )

        result = await self.session.execute(
            query,
        )

        return result.scalar() or 0

    async def count_transactions_by_ip(
        self,
        ip_address: str,
    ) -> int:
        query = select(
            func.count(
                TransactionModel.id,
            ),
        ).where(
            TransactionModel.ip_address == ip_address,
        )

        result = await self.session.execute(
            query,
        )

        return result.scalar() or 0
