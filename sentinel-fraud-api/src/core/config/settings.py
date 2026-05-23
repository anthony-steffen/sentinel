from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)


class Settings(
    BaseSettings,
):
    APP_NAME: str = "Sentinel Fraud API"
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int
    LOGIN_RATE_LIMIT: int = 5
    LOGIN_RATE_WINDOW_SECONDS: int = 60
    TRANSACTION_RATE_LIMIT: int = 20
    TRANSACTION_RATE_WINDOW_SECONDS: int = 60
    FRAUD_HIGH_AMOUNT_THRESHOLD: float = 5000
    FRAUD_HIGH_VOLUME_THRESHOLD: float = 20000
    FRAUD_HIGH_VELOCITY_THRESHOLD: int = 5

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
