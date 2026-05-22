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
    ) -> FraudAnalysisResult:
        risk_score = 0.0

        signals: list[FraudSignal] = []

        device_id = device_id.lower()

        # Regra 1 — valor alto
        if amount >= 5000:
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

        # Regra 3 — IP local
        if ip_address.startswith("10.") or ip_address.startswith("127."):
            risk_score += 10

            signals.append(
                FraudSignal.LOCAL_IP,
            )

        # Regra 4 — alta velocidade transacional
        # Agora baseada apenas em janela recente
        if recent_transactions_count >= 5:
            risk_score += 40

            signals.append(
                FraudSignal.HIGH_VELOCITY,
            )

        # Regra 5 — quantidade elevada recente
        if recent_transactions_count >= 3:
            risk_score += 15

            signals.append(
                FraudSignal.HIGH_TRANSACTION_COUNT,
            )

        # Regra 6 — volume financeiro recente
        recent_total_amount = sum(
            float(transaction.amount) for transaction in user_transactions[-5:]
        )

        if recent_total_amount >= 10000:
            risk_score += 25

            signals.append(
                FraudSignal.HIGH_TRANSACTION_VOLUME,
            )

        # Regra 7 — IP blacklistado
        if blacklisted_ip:
            risk_score += 100

            signals.append(
                FraudSignal.BLACKLISTED_IP,
            )

        # Regra 8 — device blacklistado
        if blacklisted_device:
            risk_score += 100

            signals.append(
                FraudSignal.BLACKLISTED_DEVICE,
            )

        status = TransactionStatus.APPROVED

        if risk_score >= 80:
            status = TransactionStatus.REJECTED

        elif risk_score >= 30:
            status = TransactionStatus.REVIEW

        return FraudAnalysisResult(
            risk_score=risk_score,
            status=status,
            signals=signals,
        )
