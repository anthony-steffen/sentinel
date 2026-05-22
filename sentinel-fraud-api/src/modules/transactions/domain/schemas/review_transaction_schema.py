from pydantic import BaseModel

from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)


class ReviewTransactionRequest(
    BaseModel,
):
    status: TransactionStatus
