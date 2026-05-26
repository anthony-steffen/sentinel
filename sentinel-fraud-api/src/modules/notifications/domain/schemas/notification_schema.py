from datetime import UTC
from datetime import datetime
from typing import Any
from uuid import UUID
from uuid import uuid4

from pydantic import BaseModel
from pydantic import Field

from src.modules.notifications.domain.enums.notification_enums import (
    NotificationSeverity,
    NotificationType,
)


class RealtimeNotification(
    BaseModel,
):
    id: UUID = Field(
        default_factory=uuid4,
    )

    type: NotificationType

    severity: NotificationSeverity

    title: str

    message: str

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
    )

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )
