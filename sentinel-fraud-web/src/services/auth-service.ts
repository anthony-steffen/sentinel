import { api } from "./api"

import type {
  LoginRequest,
  TokenResponse,
} from "../types/auth"


export async function loginRequest(
  data: LoginRequest,
) {
  const response = await api.post<TokenResponse>(
    "/auth/login",
    data,
  )

  return response.data
}