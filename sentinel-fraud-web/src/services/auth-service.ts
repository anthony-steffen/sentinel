import { api } from "./api"

import type {
  AuthUser,
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


export async function getCurrentUser() {
  const response = await api.get<AuthUser>(
    "/auth/me",
  )

  return response.data
}
