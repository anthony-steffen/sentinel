from sqlalchemy import select

from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.transactions.infrastructure.models.blacklist_model import (
    BlacklistModel,
)


class BlacklistRepository:
    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

    async def create(
        self,
        blacklist: BlacklistModel,
    ) -> BlacklistModel:
        self.session.add(blacklist)

        await self.session.commit()

        await self.session.refresh(
            blacklist,
        )

        return blacklist

    async def find_by_value(
        self,
        value: str,
    ) -> BlacklistModel | None:
        query = select(
            BlacklistModel,
        ).where(
            BlacklistModel.value == value,
        )

        result = await self.session.execute(
            query,
        )

        return result.scalar_one_or_none()

    async def list_all(
        self,
    ) -> list[BlacklistModel]:
        query = select(
            BlacklistModel,
        )

        result = await self.session.execute(
            query,
        )

        return list(
            result.scalars().all(),
        )
