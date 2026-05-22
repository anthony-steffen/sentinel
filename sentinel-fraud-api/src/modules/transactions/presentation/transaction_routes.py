from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database.database import get_db

from src.modules.auth.dependencies.current_user import (
    get_current_user,
)

from src.modules.auth.dependencies.roles import (
    require_roles,
)

from src.modules.transactions.domain.enums.blacklist_type_enums import (
    BlacklistType,
)

from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)

from src.modules.transactions.domain.schemas.transaction_schema import (
    CreateTransactionRequest,
    TransactionAnalyticsResponse,
    TransactionResponse,
)

from src.modules.transactions.domain.schemas.review_transaction_schema import (
    ReviewTransactionRequest,
)

from src.modules.transactions.infrastructure.models.transaction_model import (
    TransactionModel,
)

from src.modules.transactions.infrastructure.repositories.blacklist_repository import (  # noqa: E501
    BlacklistRepository,
)

from src.modules.transactions.infrastructure.repositories.transaction_repository import (  # noqa: E501
    TransactionRepository,
)

from src.modules.transactions.services.fraud_detector import (
    FraudDetector,
)

from src.modules.users.domain.enums.user_enums import (
    UserRole,
)

from src.modules.audit.domain.enums.audit_action import (
    AuditAction,
)

from src.modules.audit.services.audit_service import (
    AuditService,
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
    transaction_repository = TransactionRepository(session)

    blacklist_repository = BlacklistRepository(session)

    user_transactions = await transaction_repository.find_by_user_id(
        current_user.id,
    )

    recent_transactions_count = await transaction_repository.count_recent_transactions(
        current_user.id,
    )

    blacklisted_ip = await blacklist_repository.find_by_value(
        data.ip_address,
    )

    blacklisted_device = await blacklist_repository.find_by_value(
        data.device_id,
    )

    if blacklisted_ip and blacklisted_ip.type != BlacklistType.IP:
        blacklisted_ip = None

    if blacklisted_device and blacklisted_device.type != BlacklistType.DEVICE:
        blacklisted_device = None

    analysis = FraudDetector.analyze(
        amount=float(data.amount),
        ip_address=data.ip_address,
        device_id=data.device_id,
        user_transactions=user_transactions,
        recent_transactions_count=recent_transactions_count,
        blacklisted_ip=blacklisted_ip,
        blacklisted_device=blacklisted_device,
    )

    transaction = TransactionModel(
        user_id=current_user.id,
        amount=data.amount,
        ip_address=data.ip_address,
        device_id=data.device_id,
        risk_score=analysis.risk_score,
        fraud_signals=[signal.value for signal in analysis.signals],
        status=analysis.status,
    )

    transaction = await transaction_repository.create(
        transaction,
    )

    await AuditService.log(
        session=session,
        action=AuditAction.TRANSACTION_CREATED,
        ip_address=data.ip_address,
        user_id=str(current_user.id),
    )

    return transaction


@router.get(
    "/",
    response_model=list[TransactionResponse],
)
async def list_transactions(
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ANALYST,
        ),
    ),
):
    repository = TransactionRepository(session)

    transactions = await repository.list_all()

    return transactions


@router.get(
    "/my",
    response_model=list[TransactionResponse],
)
async def my_transactions(
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    repository = TransactionRepository(session)

    transactions = await repository.find_by_user_id(
        current_user.id,
    )

    return transactions


@router.get(
    "/analytics",
    response_model=TransactionAnalyticsResponse,
)
async def transaction_analytics(
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ANALYST,
        ),
    ),
):
    repository = TransactionRepository(session)

    transactions = await repository.list_all()

    total_transactions = len(
        transactions,
    )

    total_amount = sum(float(transaction.amount) for transaction in transactions)

    average_risk_score = 0.0

    if total_transactions > 0:
        average_risk_score = (
            sum(transaction.risk_score for transaction in transactions)
            / total_transactions
        )

    approved_transactions = len(
        [
            transaction
            for transaction in transactions
            if transaction.status == TransactionStatus.APPROVED
        ]
    )

    rejected_transactions = len(
        [
            transaction
            for transaction in transactions
            if transaction.status == TransactionStatus.REJECTED
        ]
    )

    review_transactions = len(
        [
            transaction
            for transaction in transactions
            if transaction.status == TransactionStatus.REVIEW
        ]
    )

    return TransactionAnalyticsResponse(
        total_transactions=total_transactions,
        total_amount=total_amount,
        average_risk_score=average_risk_score,
        approved_transactions=approved_transactions,
        rejected_transactions=rejected_transactions,
        review_transactions=review_transactions,
    )


@router.patch(
    "/review/{transaction_id}",
    response_model=TransactionResponse,
)
async def review_transaction(
    transaction_id,
    data: ReviewTransactionRequest,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ANALYST,
        ),
    ),
):
    repository = TransactionRepository(session)

    transaction = await repository.find_by_id(
        transaction_id,
    )

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found",
        )

    audit_action = AuditAction.TRANSACTION_REVIEWED

    if data.status == TransactionStatus.APPROVED:
        audit_action = AuditAction.TRANSACTION_APPROVED

    elif data.status == TransactionStatus.REJECTED:
        audit_action = AuditAction.TRANSACTION_REJECTED

    transaction.status = data.status

    transaction = await repository.update(
        transaction,
    )

    await AuditService.log(
        session=session,
        action=audit_action,
        ip_address=transaction.ip_address,
        user_id=str(current_user.id),
    )

    return transaction


@router.get(
    "/review-queue",
    response_model=list[TransactionResponse],
)
async def review_queue(
    session: AsyncSession = Depends(get_db),
    current_user=Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.ANALYST,
        ),
    ),
):
    repository = TransactionRepository(session)

    transactions = await repository.get_review_queue()

    return transactions
