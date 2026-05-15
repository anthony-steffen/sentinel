from fastapi import FastAPI

app = FastAPI(
    title="Sentinel Fraud API",
)


@app.get("/health")
async def healthcheck():
    return {"status": "ok"}
