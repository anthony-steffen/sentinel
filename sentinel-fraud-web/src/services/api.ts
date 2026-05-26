import axios from "axios"
import { useAuthStore } from "../store/auth-store"


export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
})


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "sentinel-access-token",
    )

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config
  },
)

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
      useAuthStore
        .getState()
        .logout()

      window.location.href = "/"
    }

    return Promise.reject(
      error,
    )
  },
)