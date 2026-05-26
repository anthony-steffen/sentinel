import { api } from "./api"

import type { Transaction } from "../types/transaction"


export async function getReviewQueue() {
  const response =
    await api.get<Transaction[]>(
      "/transactions/review-queue",
    )

  return response.data
}


export async function reviewTransaction(
  transactionId: string,
  status: "APPROVED" | "REJECTED",
) {
  const response = await api.patch(
    `/transactions/review/${transactionId}`,
    {
      status,
    },
  )

  return response.data
}