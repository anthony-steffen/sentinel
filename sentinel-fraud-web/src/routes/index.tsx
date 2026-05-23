import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom"

import { LoginPage } from "../pages/LoginPage"
import { DashboardPage } from "../pages/DashboardPage"
import { ProtectedRoute } from "./ProtectedRoute"


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

      </Routes>
    </BrowserRouter>
  )
}