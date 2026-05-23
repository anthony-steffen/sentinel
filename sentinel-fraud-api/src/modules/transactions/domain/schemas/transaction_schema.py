from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel

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

    class Config:
        from_attributes = True


class AnalyticsEntityResponse(
    BaseModel,
):
    value: str
    count: int


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
