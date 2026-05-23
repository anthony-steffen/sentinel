from collections import defaultdict
from datetime import UTC
from datetime import datetime
from datetime import timedelta

from fastapi import HTTPException

from src.core.config.settings import settings


class RateLimiter:
    login_attempts: dict[str, list[datetime]] = defaultdict(
        list,
    )

    transaction_attempts: dict[str, list[datetime]] = defaultdict(
        list,
    )

    @classmethod
    def check_login_rate_limit(
        cls,
        identifier: str,
    ) -> None:
        now = datetime.now(
            UTC,
        )

        window_start = now - timedelta(
            seconds=settings.LOGIN_RATE_WINDOW_SECONDS,
        )

        attempts = cls.login_attempts[identifier]

        cls.login_attempts[identifier] = [
            attempt for attempt in attempts if attempt >= window_start
        ]

        if len(cls.login_attempts[identifier]) >= settings.LOGIN_RATE_LIMIT:
            raise HTTPException(
                status_code=429,
                detail="Too many login attempts",
            )

        cls.login_attempts[identifier].append(
            now,
        )

    @classmethod
    def check_transaction_rate_limit(
        cls,
        identifier: str,
    ) -> None:
        now = datetime.now(
            UTC,
        )

        window_start = now - timedelta(
            seconds=settings.TRANSACTION_RATE_WINDOW_SECONDS,
        )

        attempts = cls.transaction_attempts[identifier]

        cls.transaction_attempts[identifier] = [
            attempt for attempt in attempts if attempt >= window_start
        ]

        if (
            len(cls.transaction_attempts[identifier])
            >= settings.TRANSACTION_RATE_LIMIT  # noqa: E501
        ):
            raise HTTPException(
                status_code=429,
                detail="Too many transaction attempts",
            )

        cls.transaction_attempts[identifier].append(
            now,
        )
