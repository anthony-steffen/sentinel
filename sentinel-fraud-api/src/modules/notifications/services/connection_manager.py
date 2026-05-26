from fastapi import WebSocket

from src.modules.notifications.domain.schemas.notification_schema import (
    RealtimeNotification,
)


class NotificationConnectionManager:
    def __init__(
        self,
    ):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(
        self,
        connection_id: str,
        websocket: WebSocket,
    ) -> None:
        await websocket.accept()

        self.active_connections[connection_id] = websocket

    def disconnect(
        self,
        connection_id: str,
    ) -> None:
        self.active_connections.pop(
            connection_id,
            None,
        )

    async def broadcast(
        self,
        notification: RealtimeNotification,
    ) -> None:
        payload = notification.model_dump(
            mode="json",
        )

        disconnected_connections: list[str] = []

        for connection_id, websocket in self.active_connections.items():
            try:
                await websocket.send_json(
                    payload,
                )
            except RuntimeError:
                disconnected_connections.append(
                    connection_id,
                )

        for connection_id in disconnected_connections:
            self.disconnect(
                connection_id,
            )


notification_connection_manager = NotificationConnectionManager()
