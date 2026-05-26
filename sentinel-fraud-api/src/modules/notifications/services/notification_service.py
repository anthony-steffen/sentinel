from typing import Any

from src.modules.notifications.domain.enums.notification_enums import (
    NotificationSeverity,
    NotificationType,
)

from src.modules.notifications.domain.schemas.notification_schema import (
    RealtimeNotification,
)

from src.modules.notifications.services.connection_manager import (
    notification_connection_manager,
)


class NotificationService:
    @staticmethod
    async def publish(
        notification_type: NotificationType,
        severity: NotificationSeverity,
        title: str,
        message: str,
        metadata: dict[str, Any] | None = None,
    ) -> RealtimeNotification:
        notification = RealtimeNotification(
            type=notification_type,
            severity=severity,
            title=title,
            message=message,
            metadata=metadata or {},
        )

        await notification_connection_manager.broadcast(
            notification,
        )

        return notification

    @staticmethod
    async def send_transaction_review_alert(
        transaction_id: str,
        risk_score: float,
    ) -> None:
        await NotificationService.publish(
            notification_type=NotificationType.TRANSACTION_REVIEW,
            severity=NotificationSeverity.WARNING,
            title="Transaction sent to review",
            message=(
                "A suspicious transaction is waiting for analyst review."
            ),
            metadata={
                "transaction_id": transaction_id,
                "risk_score": risk_score,
            },
        )

    @staticmethod
    async def send_high_risk_transaction_alert(
        transaction_id: str,
        risk_score: float,
    ) -> None:
        await NotificationService.publish(
            notification_type=NotificationType.HIGH_RISK_TRANSACTION,
            severity=NotificationSeverity.CRITICAL,
            title="High-risk transaction detected",
            message=(
                "A high-risk transaction was automatically rejected."
            ),
            metadata={
                "transaction_id": transaction_id,
                "risk_score": risk_score,
            },
        )

    @staticmethod
    async def send_rejected_transaction_alert(
        transaction_id: str,
    ) -> None:
        await NotificationService.publish(
            notification_type=NotificationType.TRANSACTION_REJECTED,
            severity=NotificationSeverity.CRITICAL,
            title="Transaction rejected",
            message=(
                "A transaction was rejected during manual review."
            ),
            metadata={
                "transaction_id": transaction_id,
            },
        )

    @staticmethod
    async def send_transaction_status_updated_alert(
        transaction_id: str,
        status: str,
    ) -> None:
        await NotificationService.publish(
            notification_type=NotificationType.TRANSACTION_STATUS_UPDATED,
            severity=NotificationSeverity.SUCCESS,
            title="Transaction status updated",
            message=(
                f"Transaction status changed to {status.lower()}."
            ),
            metadata={
                "transaction_id": transaction_id,
                "status": status,
            },
        )

    @staticmethod
    async def send_brute_force_alert(
        identifier: str,
    ) -> None:
        await NotificationService.publish(
            notification_type=NotificationType.SECURITY_ALERT,
            severity=NotificationSeverity.CRITICAL,
            title="Possible brute force detected",
            message=(
                "Login attempts exceeded the configured safety threshold."
            ),
            metadata={
                "identifier": identifier,
            },
        )
