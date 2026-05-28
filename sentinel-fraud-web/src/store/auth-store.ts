import { jwtDecode } from "jwt-decode"

import { create } from "zustand"

import type { AuthUser } from "../types/auth"


interface JwtPayload {
  exp: number
}


interface AuthState {
  accessToken: string | null

  currentUser: AuthUser | null

  isSessionResolved: boolean

  setAccessToken: (
    token: string | null,
  ) => void

  setCurrentUser: (
    user: AuthUser | null,
  ) => void

  setSessionResolved: (
    resolved: boolean,
  ) => void

  logout: () => void
}


function isTokenValid(
  token: string | null,
) {
  if (!token) {
    return false
  }

  try {
    const decoded =
      jwtDecode<JwtPayload>(
        token,
      )

    const currentTime =
      Date.now() / 1000

    return decoded.exp > currentTime
  } catch {
    return false
  }
}


const storedToken = localStorage.getItem(
  "sentinel-access-token",
)

const validToken = isTokenValid(
  storedToken,
)
  ? storedToken
  : null

if (!validToken) {
  localStorage.removeItem(
    "sentinel-access-token",
  )
}


export const useAuthStore = create<AuthState>(
  (set) => ({
    accessToken: validToken,

    currentUser: null,

    isSessionResolved: !validToken,

    setAccessToken: (token) => {
      if (token) {
        localStorage.setItem(
          "sentinel-access-token",
          token,
        )
      } else {
        localStorage.removeItem(
          "sentinel-access-token",
        )
      }

      set({
        accessToken: token,
        currentUser: null,
        isSessionResolved: !token,
      })
    },

    setCurrentUser: (user) => {
      set({
        currentUser: user,
        isSessionResolved: true,
      })
    },

    setSessionResolved: (
      resolved,
    ) => {
      set({
        isSessionResolved: resolved,
      })
    },

    logout: () => {
      localStorage.removeItem(
        "sentinel-access-token",
      )

      set({
        accessToken: null,
        currentUser: null,
        isSessionResolved: true,
      })
    },
  }),
)
