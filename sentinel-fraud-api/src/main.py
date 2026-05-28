from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config.settings import (
    settings,
)

from src.modules.auth.presentation.auth_routes import (
    router as auth_router,
)

from src.modules.users.presentation.user_routes import (
    router as users_router,
)

from src.modules.transactions.presentation.transaction_routes import (
    router as transactions_router,
)

from src.modules.transactions.presentation.blacklist_routes import (
    router as blacklist_router,
)

from src.modules.audit.presentation.audit_routes import (
    router as audit_router,
)

from src.modules.dashboard.presentation.dashboard_routes import (
    router as dashboard_router,
)

from src.modules.notifications.presentation.notification_routes import (
    router as notifications_router,
)

app = FastAPI(
    title="Sentinel Fraud API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def healthcheck():
    return {
        "status": "ok",
    }


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(transactions_router)
app.include_router(blacklist_router)
app.include_router(audit_router)
app.include_router(dashboard_router)
app.include_router(notifications_router)
