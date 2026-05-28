from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)


class Settings(
    BaseSettings,
):
    APP_NAME: str = "Sentinel Fraud API"
    APP_ENV: str = "development"
    DATABASE_URL: str | None = None
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "sentinel"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    LOGIN_RATE_LIMIT: int = 5
    LOGIN_RATE_WINDOW_SECONDS: int = 60
    TRANSACTION_RATE_LIMIT: int = 20
    TRANSACTION_RATE_WINDOW_SECONDS: int = 60
    FRAUD_HIGH_AMOUNT_THRESHOLD: float = 5000
    FRAUD_HIGH_VOLUME_THRESHOLD: float = 20000
    FRAUD_HIGH_VELOCITY_THRESHOLD: int = 5
    CORS_ALLOWED_ORIGINS: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @property
    def cors_allowed_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.CORS_ALLOWED_ORIGINS.split(
                ",",
            )
            if origin.strip()
        ]

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            if self.DATABASE_URL.startswith(
                "postgresql+asyncpg://",
            ):
                return self.DATABASE_URL

            if self.DATABASE_URL.startswith(
                "postgresql://",
            ):
                return self.DATABASE_URL.replace(
                    "postgresql://",
                    "postgresql+asyncpg://",
                    1,
                )

            if self.DATABASE_URL.startswith(
                "postgres://",
            ):
                return self.DATABASE_URL.replace(
                    "postgres://",
                    "postgresql+asyncpg://",
                    1,
                )

            return self.DATABASE_URL

        return (
            f"postgresql+asyncpg://"
            f"{self.DB_USER}:"
            f"{self.DB_PASSWORD}@"
            f"{self.DB_HOST}:"
            f"{self.DB_PORT}/"
            f"{self.DB_NAME}"
        )


settings = Settings()
