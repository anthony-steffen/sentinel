import { jwtDecode } from "jwt-decode"

import { create } from "zustand"


interface JwtPayload {
  exp: number
}


interface AuthState {
  accessToken: string | null

  setAccessToken: (
    token: string | null,
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
      })
    },

    logout: () => {
      localStorage.removeItem(
        "sentinel-access-token",
      )

      set({
        accessToken: null,
      })
    },
  }),
)