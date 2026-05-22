from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.audit.domain.enums.audit_action import (
    AuditAction,
)

from src.modules.audit.infrastructure.models.audit_model import (
    AuditModel,
)

from src.modules.audit.infrastructure.repositories.audit_repository import (
    AuditRepository,
)


class AuditService:
    @staticmethod
    async def log(
        session: AsyncSession,
        action: AuditAction,
        ip_address: str,
        user_id: str | None = None,
    ) -> None:
        repository = AuditRepository(session)

        audit = AuditModel(
            user_id=user_id,
            action=action,
            ip_address=ip_address,
        )

        await repository.create(
            audit,
        )
