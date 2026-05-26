from decimal import Decimal
from datetime import date
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from pydantic import ConfigDict

from src.modules.transactions.domain.enums.fraud_signal_enums import (
    FraudSignal,
)

from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)


class CreateTransactionRequest(
    BaseModel,
):
    amount: Decimal
    ip_address: str
    device_id: str


class TransactionResponse(
    BaseModel,
):
    id: UUID
    user_id: UUID
    amount: Decimal
    ip_address: str
    device_id: str
    risk_score: float
    fraud_signals: list[FraudSignal]
    status: TransactionStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class AnalyticsEntityResponse(
    BaseModel,
):
    value: str
    count: int


class AnalyticsStatusResponse(
    BaseModel,
):
    status: TransactionStatus
    count: int
    percentage: float


class AnalyticsRiskBucketResponse(
    BaseModel,
):
    label: str
    min_score: float
    max_score: float
    count: int
    percentage: float


class AnalyticsSignalResponse(
    BaseModel,
):
    signal: FraudSignal
    count: int


class AnalyticsDailyVolumeResponse(
    BaseModel,
):
    date: date
    count: int
    total_amount: float


class TransactionAnalyticsResponse(
    BaseModel,
):
    total_transactions: int
    total_amount: float
    average_risk_score: float
    approved_transactions: int
    rejected_transactions: int
    review_transactions: int
    fraud_rate: float
    review_rate: float
    approval_rate: float
    top_ips: list[AnalyticsEntityResponse]
    top_devices: list[AnalyticsEntityResponse]
    status_distribution: list[AnalyticsStatusResponse]
    risk_buckets: list[AnalyticsRiskBucketResponse]
    top_signals: list[AnalyticsSignalResponse]
    daily_volume: list[AnalyticsDailyVolumeResponse]
