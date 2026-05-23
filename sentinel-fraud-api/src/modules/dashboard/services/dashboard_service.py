from src.modules.transactions.domain.enums.transaction_enums import (
    TransactionStatus,
)

from src.modules.transactions.infrastructure.models.transaction_model import (
    TransactionModel,
)


class DashboardService:
    @staticmethod
    def build_summary(
        transactions: list[TransactionModel],
    ):
        total_transactions = len(
            transactions,
        )

        approved_transactions = len(
            [
                transaction
                for transaction in transactions
                if (transaction.status == TransactionStatus.APPROVED)
            ]
        )

        rejected_transactions = len(
            [
                transaction
                for transaction in transactions
                if (transaction.status == TransactionStatus.REJECTED)
            ]
        )

        review_transactions = len(
            [
                transaction
                for transaction in transactions
                if (transaction.status == TransactionStatus.REVIEW)
            ]
        )

        average_risk_score = 0.0

        fraud_rate = 0.0

        review_rate = 0.0

        approval_rate = 0.0

        if total_transactions > 0:
            average_risk_score = (
                sum(transaction.risk_score for transaction in transactions)
                / total_transactions
            )

            fraud_rate = (rejected_transactions / total_transactions) * 100

            review_rate = (review_transactions / total_transactions) * 100

            approval_rate = (approved_transactions / total_transactions) * 100

        return {
            "total_transactions": total_transactions,
            "approved_transactions": approved_transactions,
            "rejected_transactions": rejected_transactions,
            "review_transactions": review_transactions,
            "fraud_rate": fraud_rate,
            "review_rate": review_rate,
            "approval_rate": approval_rate,
            "average_risk_score": average_risk_score,
        }
