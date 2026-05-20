from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database.database import get_db

from src.modules.auth.dependencies.current_user import (
    get_current_user,
)

from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)

from src.modules.transactions.domain.schemas.transaction_schema import (
    CreateTransactionRequest,
    TransactionResponse,
)

from src.modules.transactions.infrastructure.models.transaction_model import (
    TransactionModel,
)

from src.modules.transactions.infrastructure.repositories.transaction_repository import (  # noqa: E501
    TransactionRepository,
)

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)


@router.post(
    "/",
    response_model=TransactionResponse,
)
async def create_transaction(
    data: CreateTransactionRequest,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repository = TransactionRepository(session)

    risk_score = 15.0

    status = TransactionStatus.APPROVED

    if data.amount >= 5000:
        risk_score = 85.0
        status = TransactionStatus.REVIEW

    transaction = TransactionModel(
        user_id=current_user.id,
        amount=data.amount,
        ip_address=data.ip_address,
        device_id=data.device_id,
        risk_score=risk_score,
        status=status,
    )

    transaction = await repository.create(
        transaction,
    )

    return transaction


@router.get(
    "/",
    response_model=list[TransactionResponse],
)
async def list_transactions(
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repository = TransactionRepository(session)

    transactions = await repository.list_all()

    return transactions
