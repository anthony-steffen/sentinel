from src.core.config.settings import settings

from src.modules.transactions.domain.enums.fraud_signal_enums import (
    FraudSignal,
)

from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)

from src.modules.transactions.infrastructure.models.blacklist_model import (
    BlacklistModel,
)

from src.modules.transactions.infrastructure.models.transaction_model import (
    TransactionModel,
)


class FraudAnalysisResult:
    def __init__(
        self,
        risk_score: float,
        status: TransactionStatus,
        signals: list[FraudSignal],
    ):
        self.risk_score = risk_score
        self.status = status
        self.signals = signals


class FraudDetector:
    @staticmethod
    def analyze(
        amount: float,
        ip_address: str,
        device_id: str,
        user_transactions: list[TransactionModel],
        recent_transactions_count: int,
        blacklisted_ip: BlacklistModel | None,
        blacklisted_device: BlacklistModel | None,
        device_transaction_count: int,
        ip_transaction_count: int,
    ) -> FraudAnalysisResult:
        risk_score = 0.0

        signals: list[FraudSignal] = []

        device_id = device_id.lower()

        # Regra 1 — valor alto
        if amount >= settings.FRAUD_HIGH_AMOUNT_THRESHOLD:
            risk_score += 70

            signals.append(
                FraudSignal.HIGH_AMOUNT,
            )

        # Regra 2 — device suspeito
        suspicious_devices = [
            "unknown",
            "emulator",
            "bot",
        ]

        if any(keyword in device_id for keyword in suspicious_devices):
            risk_score += 20

            signals.append(
                FraudSignal.SUSPICIOUS_DEVICE,
            )

        # Regra 3 — IP local/suspeito
        if ip_address.startswith("10.") or ip_address.startswith("127."):
            risk_score += 10

            signals.append(
                FraudSignal.LOCAL_IP,
            )

        # Regra 4 — muitas transações históricas
        if len(user_transactions) >= 10:
            risk_score += 10

            signals.append(
                FraudSignal.HIGH_TRANSACTION_COUNT,
            )

        # Regra 5 — alto volume financeiro
        total_amount = sum(
            float(transaction.amount) for transaction in user_transactions
        )

        if total_amount >= settings.FRAUD_HIGH_VOLUME_THRESHOLD:
            risk_score += 15

            signals.append(
                FraudSignal.HIGH_TRANSACTION_VOLUME,
            )

        # Regra 6 — IP blacklistado
        if blacklisted_ip:
            risk_score += 100

            signals.append(
                FraudSignal.BLACKLISTED_IP,
            )

        # Regra 7 — device blacklistado
        if blacklisted_device:
            risk_score += 100

            signals.append(
                FraudSignal.BLACKLISTED_DEVICE,
            )

        # Regra 8 — alta velocidade transacional
        if recent_transactions_count >= settings.FRAUD_HIGH_VELOCITY_THRESHOLD:
            risk_score += 40

            signals.append(
                FraudSignal.HIGH_VELOCITY,
            )

        # Regra 9 — device altamente recorrente
        if device_transaction_count >= 20:
            risk_score += 15

        # Regra 10 — IP altamente recorrente
        if ip_transaction_count >= 30:
            risk_score += 20

        status = TransactionStatus.APPROVED

        if risk_score >= 80:
            status = TransactionStatus.REJECTED

        elif risk_score >= 40:
            status = TransactionStatus.REVIEW

        return FraudAnalysisResult(
            risk_score=risk_score,
            status=status,
            signals=signals,
        )
