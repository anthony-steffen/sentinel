export interface LoginRequest {
  email: string
  password: string
}

export type UserRole =
  | "ADMIN"
  | "ANALYST"
  | "OPERATOR"

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "BLOCKED"

export interface TokenResponse {
  access_token: string
  refresh_token: string
}

export interface AuthUser {
  id: string
  email: string
  full_name: string
  role: UserRole
  status: UserStatus
}
