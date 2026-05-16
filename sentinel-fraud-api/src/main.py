from fastapi import FastAPI

from src.modules.auth.presentation.auth_routes import (
    router as auth_router,
)

from src.modules.users.presentation.user_routes import (
    router as users_router,
)

app = FastAPI(
    title="Sentinel Fraud API",
)


@app.get("/health")
async def healthcheck():
    return {
        "status": "ok",
    }


app.include_router(users_router)
app.include_router(auth_router)
