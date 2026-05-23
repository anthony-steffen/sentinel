class NotificationService:
    @staticmethod
    async def send_high_risk_transaction_alert(
        transaction_id: str,
        risk_score: float,
    ) -> None:
        print(
            (
                "[ALERT] High risk transaction detected | "
                f"transaction_id={transaction_id} | "
                f"risk_score={risk_score}"
            )
        )

    @staticmethod
    async def send_rejected_transaction_alert(
        transaction_id: str,
    ) -> None:
        print(
            (
                "[ALERT] Transaction rejected | "
                f"transaction_id={transaction_id}"  # noqa: E501
            )
        )

    @staticmethod
    async def send_brute_force_alert(
        identifier: str,
    ) -> None:
        print(
            (
                "[ALERT] Possible brute force detected | "
                f"identifier={identifier}"  # noqa: E501
            )
        )
