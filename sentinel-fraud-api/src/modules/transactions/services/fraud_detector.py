from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)

from src.modules.transactions.infrastructure.models.transaction_model import (
    TransactionModel,
)


class FraudAnalysisResult:
    def __init__(
        self,
        risk_score: float,
        status: TransactionStatus,
    ):
        self.risk_score = risk_score
        self.status = status


class FraudDetector:
    @staticmethod
    def analyze(
        amount: float,
        ip_address: str,
        device_id: str,
        user_transactions: list[TransactionModel],
    ) -> FraudAnalysisResult:
        risk_score = 0.0

        device_id = device_id.lower()

        # Regra 1 — valor alto
        if amount >= 5000:
            risk_score += 70

        # Regra 2 — device suspeito
        suspicious_devices = [
            "unknown",
            "emulator",
            "bot",
        ]

        if any(keyword in device_id for keyword in suspicious_devices):
            risk_score += 20

        # Regra 3 — IP suspeito/local
        if ip_address.startswith("10.") or ip_address.startswith("127."):
            risk_score += 10

        # Regra 4 — muitas transações
        if len(user_transactions) >= 5:
            risk_score += 15

        # Regra 5 — alto volume acumulado
        total_amount = sum(
            float(transaction.amount) for transaction in user_transactions
        )

        if total_amount >= 20000:
            risk_score += 25

        status = TransactionStatus.APPROVED

        if risk_score >= 80:
            status = TransactionStatus.REJECTED

        elif risk_score >= 30:
            status = TransactionStatus.REVIEW

        return FraudAnalysisResult(
            risk_score=risk_score,
            status=status,
        )
