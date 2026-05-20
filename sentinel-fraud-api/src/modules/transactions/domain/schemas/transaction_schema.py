from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel

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
    status: TransactionStatus

    class Config:
        from_attributes = True
