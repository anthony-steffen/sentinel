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
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
        />

        <Route
          path="/transactions"
          element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
        />

        <Route
          path="/review-queue"
          element={
          <ProtectedRoute>
            <ReviewQueuePage />
          </ProtectedRoute>
        }
        />

        <Route
          path="/audit-logs"
          element={
          <ProtectedRoute>
            <AuditLogsPage />
          </ProtectedRoute>
        }
        />

      </Routes>
    </BrowserRouter>
  )
}