from src.modules.audit.infrastructure.models.audit_model import (
    AuditModel,
)


class AuditRepository:
    def __init__(self, session):
        self.session = session

    async def create(
        self,
        audit: AuditModel,
    ) -> AuditModel:
        self.session.add(audit)

        await self.session.commit()

        await self.session.refresh(audit)

        return audit
