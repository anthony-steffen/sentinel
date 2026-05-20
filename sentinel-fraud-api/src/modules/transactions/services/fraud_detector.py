from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
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
    ) -> FraudAnalysisResult:
        risk_score = 0.0

        device_id = device_id.lower()

        if amount >= 5000:
            risk_score += 70

        suspicious_devices = [
            "unknown",
            "emulator",
            "bot",
        ]

        if any(keyword in device_id for keyword in suspicious_devices):
            risk_score += 20

        if ip_address.startswith("10.") or ip_address.startswith("127."):
            risk_score += 10

        status = TransactionStatus.APPROVED

        if risk_score >= 80:
            status = TransactionStatus.REJECTED

        elif risk_score >= 30:
            status = TransactionStatus.REVIEW

        return FraudAnalysisResult(
            risk_score=risk_score,
            status=status,
        )
