import { api } from "./api"

import type {
  Transaction,
  TransactionAnalytics,
} from "../types/transaction"


export async function getTransactions() {
  const response =
    await api.get<Transaction[]>(
      "/transactions/",
    )

  return response.data
}


export async function getTransactionAnalytics() {
  const response =
    await api.get<TransactionAnalytics>(
      "/transactions/analytics",
    )

  return response.data
}
