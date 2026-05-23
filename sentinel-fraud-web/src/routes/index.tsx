import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom"

import { LoginPage } from "../pages/LoginPage"


export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LoginPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}