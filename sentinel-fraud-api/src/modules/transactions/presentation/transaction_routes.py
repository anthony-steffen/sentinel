from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database.database import get_db

from src.modules.auth.dependencies.current_user import (
    get_current_user,
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

from src.modules.transactions.services.fraud_detector import (
    FraudDetector,
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

    analysis = FraudDetector.analyze(
        amount=float(data.amount),
        ip_address=data.ip_address,
        device_id=data.device_id,
    )

    transaction = TransactionModel(
        user_id=current_user.id,
        amount=data.amount,
        ip_address=data.ip_address,
        device_id=data.device_id,
        risk_score=analysis.risk_score,
        status=analysis.status,
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
