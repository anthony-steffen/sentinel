from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from pydantic import ConfigDict

from src.modules.audit.domain.enums.audit_action import (
    AuditAction,
)


class AuditResponse(
    BaseModel,
):
    id: UUID

    user_id: UUID | None

    action: AuditAction

    ip_address: str

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )
