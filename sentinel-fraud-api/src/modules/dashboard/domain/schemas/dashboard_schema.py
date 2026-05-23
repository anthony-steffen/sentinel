from pydantic import BaseModel


class DashboardSummaryResponse(
    BaseModel,
):
    total_transactions: int
    approved_transactions: int
    rejected_transactions: int
    review_transactions: int
    fraud_rate: float
    review_rate: float
    approval_rate: float
    average_risk_score: float
