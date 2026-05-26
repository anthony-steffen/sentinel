from collections import Counter
from datetime import datetime
from datetime import timedelta
from datetime import timezone

from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)

from src.modules.transactions.domain.schemas.transaction_schema import (
    AnalyticsDailyVolumeResponse,
    AnalyticsEntityResponse,
    AnalyticsRiskBucketResponse,
    AnalyticsSignalResponse,
    AnalyticsStatusResponse,
    TransactionAnalyticsResponse,
)

from src.modules.transactions.infrastructure.models.transaction_model import (
    TransactionModel,
)


class TransactionAnalyticsService:
    @staticmethod
    def build(
        transactions: list[TransactionModel],
    ) -> TransactionAnalyticsResponse:
        total_transactions = len(
            transactions,
        )

        total_amount = sum(
            float(transaction.amount) for transaction in transactions
        )

        average_risk_score = 0.0

        if total_transactions > 0:
            average_risk_score = (
                sum(transaction.risk_score for transaction in transactions)
                / total_transactions
            )

        status_counter = Counter(
            transaction.status for transaction in transactions
        )

        approved_transactions = status_counter[
            TransactionStatus.APPROVED
        ]

        rejected_transactions = status_counter[
            TransactionStatus.REJECTED
        ]

        review_transactions = status_counter[
            TransactionStatus.REVIEW
        ]

        fraud_rate = TransactionAnalyticsService._percentage(
            rejected_transactions,
            total_transactions,
        )

        review_rate = TransactionAnalyticsService._percentage(
            review_transactions,
            total_transactions,
        )

        approval_rate = TransactionAnalyticsService._percentage(
            approved_transactions,
            total_transactions,
        )

        return TransactionAnalyticsResponse(
            total_transactions=total_transactions,
            total_amount=total_amount,
            average_risk_score=average_risk_score,
            approved_transactions=approved_transactions,
            rejected_transactions=rejected_transactions,
            review_transactions=review_transactions,
            fraud_rate=fraud_rate,
            review_rate=review_rate,
            approval_rate=approval_rate,
            top_ips=TransactionAnalyticsService._top_entities(
                [
                    transaction.ip_address
                    for transaction in transactions
                ],
            ),
            top_devices=TransactionAnalyticsService._top_entities(
                [
                    transaction.device_id
                    for transaction in transactions
                ],
            ),
            status_distribution=TransactionAnalyticsService._status_distribution(  # noqa: E501
                status_counter,
                total_transactions,
            ),
            risk_buckets=TransactionAnalyticsService._risk_buckets(
                transactions,
                total_transactions,
            ),
            top_signals=TransactionAnalyticsService._top_signals(
                transactions,
            ),
            daily_volume=TransactionAnalyticsService._daily_volume(
                transactions,
            ),
        )

    @staticmethod
    def _percentage(
        value: int,
        total: int,
    ) -> float:
        if total == 0:
            return 0.0

        return (value / total) * 100

    @staticmethod
    def _top_entities(
        values: list[str],
    ) -> list[AnalyticsEntityResponse]:
        counter = Counter(
            values,
        )

        return [
            AnalyticsEntityResponse(
                value=value,
                count=count,
            )
            for value, count in counter.most_common(
                5,
            )
        ]

    @staticmethod
    def _status_distribution(
        status_counter: Counter[TransactionStatus],
        total_transactions: int,
    ) -> list[AnalyticsStatusResponse]:
        return [
            AnalyticsStatusResponse(
                status=status,
                count=status_counter[status],
                percentage=TransactionAnalyticsService._percentage(
                    status_counter[status],
                    total_transactions,
                ),
            )
            for status in TransactionStatus
        ]

    @staticmethod
    def _risk_buckets(
        transactions: list[TransactionModel],
        total_transactions: int,
    ) -> list[AnalyticsRiskBucketResponse]:
        buckets = [
            (
                "Low",
                0,
                29,
            ),
            (
                "Medium",
                30,
                79,
            ),
            (
                "High",
                80,
                100,
            ),
        ]

        response: list[AnalyticsRiskBucketResponse] = []

        for label, min_score, max_score in buckets:
            count = len(
                [
                    transaction
                    for transaction in transactions
                    if min_score <= transaction.risk_score <= max_score
                ],
            )

            response.append(
                AnalyticsRiskBucketResponse(
                    label=label,
                    min_score=min_score,
                    max_score=max_score,
                    count=count,
                    percentage=TransactionAnalyticsService._percentage(
                        count,
                        total_transactions,
                    ),
                ),
            )

        return response

    @staticmethod
    def _top_signals(
        transactions: list[TransactionModel],
    ) -> list[AnalyticsSignalResponse]:
        signal_counter: Counter[str] = Counter()

        for transaction in transactions:
            signal_counter.update(
                transaction.fraud_signals,
            )

        return [
            AnalyticsSignalResponse(
                signal=signal,
                count=count,
            )
            for signal, count in signal_counter.most_common(
                5,
            )
        ]

    @staticmethod
    def _daily_volume(
        transactions: list[TransactionModel],
    ) -> list[AnalyticsDailyVolumeResponse]:
        latest_date = datetime.now(
            timezone.utc,
        ).date()

        if transactions:
            latest_date = max(
                transaction.created_at.date()
                for transaction in transactions
            )

        count_by_day: dict = {}

        amount_by_day: dict = {}

        for transaction in transactions:
            day = transaction.created_at.date()

            count_by_day[day] = count_by_day.get(
                day,
                0,
            ) + 1

            amount_by_day[day] = amount_by_day.get(
                day,
                0.0,
            ) + float(
                transaction.amount,
            )

        start_date = latest_date - timedelta(
            days=6,
        )

        days = [
            start_date
            + timedelta(
                days=index,
            )
            for index in range(
                7,
            )
        ]

        return [
            AnalyticsDailyVolumeResponse(
                date=day,
                count=count_by_day.get(
                    day,
                    0,
                ),
                total_amount=amount_by_day.get(
                    day,
                    0.0,
                ),
            )
            for day in days
        ]
