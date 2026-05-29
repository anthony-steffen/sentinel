import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom"

import { LoginPage } from "../pages/LoginPage"
import { DashboardPage } from "../pages/DashboardPage"
import { ProtectedRoute } from "./ProtectedRoute"
import { TransactionsPage } from "../pages/TransactionsPage"
import {ReviewQueuePage} from "../pages/ReviewQueuePage"
import {AuditLogsPage} from "../pages/AuditLogsPage"
import { UnauthorizedPage } from "../pages/UnauthorizedPage"

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route
          path="/"
          element={
          <LoginPage />
        }
        />
      
        <Route
          path="/dashboard"
          element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "ANALYST",
              "OPERATOR",
            ]}
          >
            <DashboardPage />
          </ProtectedRoute>
        }
        />

        <Route
          path="/transactions"
          element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "ANALYST",
            ]}
          >
            <TransactionsPage />
          </ProtectedRoute>
        }
        />

        <Route
          path="/review-queue"
          element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "ANALYST",
            ]}
          >
            <ReviewQueuePage />
          </ProtectedRoute>
        }
        />

        <Route
          path="/audit-logs"
          element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "ANALYST",
            ]}
          >
            <AuditLogsPage />
          </ProtectedRoute>
        }
        />

        <Route
          path="/unauthorized"
          element={
          <UnauthorizedPage />
        }
        />

      </Routes>
    </BrowserRouter>
  )
}
