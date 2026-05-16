from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database.database import AsyncSessionLocal


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
