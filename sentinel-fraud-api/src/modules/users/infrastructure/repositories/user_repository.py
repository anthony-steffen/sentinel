from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.users.infrastructure.models.user_model import (
    UserModel,
)


class UserRepository:
    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

    async def create(
        self,
        user: UserModel,
    ) -> UserModel:
        self.session.add(user)

        await self.session.commit()

        await self.session.refresh(user)

        return user

    async def find_by_email(
        self,
        email: str,
    ) -> UserModel | None:
        query = select(UserModel).where(
            UserModel.email == email,
        )

        result = await self.session.execute(query)

        return result.scalar_one_or_none()

    async def find_by_id(
        self,
        user_id: UUID,
    ) -> UserModel | None:
        query = select(UserModel).where(
            UserModel.id == user_id,
        )

        result = await self.session.execute(query)

        return result.scalar_one_or_none()

    async def find_all(
        self,
    ) -> list[UserModel]:
        query = select(UserModel)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def update(
        self,
        user: UserModel,
    ) -> UserModel:
        await self.session.commit()

        await self.session.refresh(user)

        return user
