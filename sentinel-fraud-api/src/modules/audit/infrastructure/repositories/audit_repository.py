from sqlalchemy import select

from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.audit.infrastructure.models.audit_model import (
    AuditModel,
)


class AuditRepository:
    def __init__(
        self,
        session: AsyncSession,
    ):
        self.session = session

    async def create(
        self,
        audit: AuditModel,
    ) -> AuditModel:
        self.session.add(
            audit,
        )

        await self.session.commit()

        await self.session.refresh(
            audit,
        )

        return audit

    async def list_all(
        self,
    ) -> list[AuditModel]:
        query = select(
            AuditModel,
        ).order_by(
            AuditModel.created_at.desc(),
        )

        result = await self.session.execute(
            query,
        )

        return list(
            result.scalars().all(),
        )
