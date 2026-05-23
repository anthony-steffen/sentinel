import { create } from "zustand"


interface AuthState {
  accessToken: string | null

  setAccessToken: (
    token: string | null,
  ) => void

  logout: () => void
}


const storedToken = localStorage.getItem(
  "sentinel-access-token",
)


export const useAuthStore = create<AuthState>(
  (set) => ({
    accessToken: storedToken,

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