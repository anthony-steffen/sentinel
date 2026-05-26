from uuid import uuid4

from fastapi import APIRouter
from fastapi import Query
from fastapi import WebSocket
from fastapi import WebSocketDisconnect
from fastapi import status

from src.core.database.database import AsyncSessionLocal

from src.core.security.jwt import decode_token

from src.modules.notifications.services.connection_manager import (
    notification_connection_manager,
)

from src.modules.users.domain.enums.user_enums import (
    UserRole,
)

from src.modules.users.infrastructure.repositories.user_repository import (
    UserRepository,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


async def _can_connect_to_realtime(
    token: str,
) -> bool:
    try:
        payload = decode_token(
            token,
        )
    except Exception:
        return False

    user_id = payload.get(
        "sub",
    )

    if not user_id:
        return False

    async with AsyncSessionLocal() as session:
        repository = UserRepository(
            session,
        )

        user = await repository.find_by_id(
            user_id,
        )

        if not user:
            return False

        return user.role in [
            UserRole.ADMIN,
            UserRole.ANALYST,
        ]


@router.websocket(
    "/ws",
)
async def notification_websocket(
    websocket: WebSocket,
    token: str = Query(...),
):
    if not await _can_connect_to_realtime(
        token,
    ):
        await websocket.close(
            code=status.WS_1008_POLICY_VIOLATION,
        )

        return

    connection_id = str(
        uuid4(),
    )

    await notification_connection_manager.connect(
        connection_id,
        websocket,
    )

    try:
        while True:
            message = await websocket.receive_text()

            if message == "ping":
                await websocket.send_json(
                    {
                        "type": "PONG",
                    },
                )
    except WebSocketDisconnect:
        notification_connection_manager.disconnect(
            connection_id,
        )
