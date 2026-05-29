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

from src.modules.transactions.services.transaction_analytics_service import (
    TransactionAnalyticsService,
)

from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
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

from src.modules.notifications.services.notification_service import (
    NotificationService,
)

from src.core.security.rate_limit.rate_limiter import (
    RateLimiter,
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
    await RateLimiter.check_transaction_rate_limit(
        str(current_user.id),
    )

    transaction_repository = TransactionRepository(session)

    blacklist_repository = BlacklistRepository(session)

    user_transactions = await transaction_repository.find_by_user_id(
        current_user.id,
    )

    recent_transactions_count = (
        await transaction_repository.count_recent_transactions(  # noqa: E501
            current_user.id,
        )
    )

    device_transaction_count = (
        await transaction_repository.count_transactions_by_device(
            data.device_id,
        )
    )

    ip_transaction_count = (
        await transaction_repository.count_transactions_by_ip(  # noqa: E501
            data.ip_address,
        )
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
        device_transaction_count=device_transaction_count,
        ip_transaction_count=ip_transaction_count,
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

    if transaction.status == TransactionStatus.REVIEW:
        await NotificationService.send_transaction_review_alert(
            transaction_id=str(
                transaction.id,
            ),
            risk_score=transaction.risk_score,
        )

    elif transaction.status == TransactionStatus.REJECTED:
        await NotificationService.send_high_risk_transaction_alert(
            transaction_id=str(
                transaction.id,
            ),
            risk_score=transaction.risk_score,
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
            UserRole.OPERATOR,
        ),
    ),
):
    repository = TransactionRepository(session)

    transactions = await repository.list_all()

    return TransactionAnalyticsService.build(
        transactions,
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

    if data.status == TransactionStatus.REJECTED:
        await NotificationService.send_rejected_transaction_alert(
            transaction_id=str(
                transaction.id,
            ),
        )

    else:
        await NotificationService.send_transaction_status_updated_alert(
            transaction_id=str(
                transaction.id,
            ),
            status=data.status.value,
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
