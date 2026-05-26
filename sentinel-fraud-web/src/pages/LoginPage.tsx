import { useState } from "react"

import toast from "react-hot-toast"

import {
  Navigate,
  useNavigate,
} from "react-router-dom"

import { ThemeToggle } from "../components/theme-toggle"

import { loginRequest } from "../services/auth-service"

import { useAuthStore } from "../store/auth-store"


export function LoginPage() {
  const navigate = useNavigate()

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken,
  )

  const [email, setEmail] = useState(
    "",
  )

  const [password, setPassword] = useState(
    "",
  )

  const [loading, setLoading] = useState(
    false,
  )

  const [error, setError] = useState(
    "",
  )

  if (accessToken) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  async function handleLogin() {
    try {
      setLoading(
        true,
      )

      setError(
        "",
      )

      const response = await loginRequest({
        email,
        password,
      })

      setAccessToken(
        response.access_token,
      )

      toast.success(
        "Login successful",
      )

      navigate(
        "/dashboard",
      )
    } catch {
      setError(
        "Invalid credentials",
      )

      toast.error(
        "Invalid credentials",
      )
    } finally {
      setLoading(
        false,
      )
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center relative px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body gap-2">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold">
              Sentinel Fraud
            </h1>

            <p className="text-base-content/70 mt-2">
              Anti-Fraud Intelligence Platform
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>
                {error}
              </span>
            </div>
          )}

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">
                Email
              </span>
            </label>

            <input
              type="email"
              placeholder="admin@sentinel.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">
                Password
              </span>
            </label>

            <input
              type="password"
              placeholder="********"
              className="input input-bordered w-full"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
            />
          </div>

          <button
            className="btn btn-primary w-full mt-6"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  )
}