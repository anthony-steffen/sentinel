import axios from "axios"
import { useAuthStore } from "../store/auth-store"

const defaultBaseUrl =
  import.meta.env.PROD
    ? "/api"
    : "http://127.0.0.1:8000"

const apiBaseUrl =
  resolveApiBaseUrl()

function resolveApiBaseUrl() {
  const configuredBaseUrl =
    import.meta.env.VITE_API_BASE_URL?.trim()

  if (!configuredBaseUrl) {
    return defaultBaseUrl
  }

  const isPublicHost =
    !["localhost", "127.0.0.1"].includes(
      window.location.hostname,
    )

  const pointsToLocalhost =
    configuredBaseUrl.includes(
      "localhost",
    )
    || configuredBaseUrl.includes(
      "127.0.0.1",
    )

  if (
    isPublicHost &&
    pointsToLocalhost
  ) {
    return "/api"
  }

  return configuredBaseUrl
}

export const api = axios.create({
  baseURL: apiBaseUrl,
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
