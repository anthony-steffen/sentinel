import { Navigate } from "react-router-dom"

import { useAuthStore } from "../store/auth-store"

import type { UserRole } from "../types/auth"


interface ProtectedRouteProps {
  children: React.ReactNode

  allowedRoles?: UserRole[]
}


export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const currentUser = useAuthStore(
    (state) => state.currentUser,
  )

  const isSessionResolved =
    useAuthStore(
      (state) =>
        state.isSessionResolved,
    )

  if (!accessToken) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  if (!isSessionResolved) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (
    allowedRoles &&
    currentUser &&
    !allowedRoles.includes(
      currentUser.role,
    )
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    )
  }

  return children
}
