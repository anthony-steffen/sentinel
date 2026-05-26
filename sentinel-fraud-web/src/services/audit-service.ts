import { api } from "./api"

import type { AuditLog } from "../types/audit"


export async function getAuditLogs() {
  const response =
    await api.get<AuditLog[]>(
      "/audit-logs/",
    )

  return response.data
}