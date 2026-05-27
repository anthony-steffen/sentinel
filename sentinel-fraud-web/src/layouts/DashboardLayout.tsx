import {
  BarChart3,
  FileWarning,
  LayoutDashboard,
  Menu,
  ShieldAlert,
  LogOut,
} from "lucide-react"

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom"

import { NotificationDrawer } from "../components/notifications/NotificationDrawer"

import { ThemeToggle } from "../components/theme-toggle"

import { useAuthStore } from "../store/auth-store"


interface DashboardLayoutProps {
  children: React.ReactNode
}


export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const navigate = useNavigate()

  const location = useLocation()

  const logout = useAuthStore(
    (state) => state.logout,
  )

  function handleLogout() {
    logout()

    navigate(
      "/",
    )
  }

  function getNavClass(
    path: string,
  ) {
    const isActive =
      location.pathname === path

    return isActive
      ? "btn btn-primary justify-start w-full"
      : "btn btn-ghost justify-start w-full"
  }

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        <header className="h-16 bg-base-100 border-b border-base-300 px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost btn-circle lg:hidden"
            >
              <Menu size={22} />
            </label>

            <h2 className="text-lg font-semibold">
              Anti-Fraud Operations Center
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <NotificationDrawer />

            <ThemeToggle />

            <button
              className="btn btn-ghost btn-circle"
              onClick={handleLogout}
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="dashboard-drawer"
          className="drawer-overlay"
        />

        <aside className="w-72 min-h-full bg-base-100 border-r border-base-300 flex flex-col">
          <div className="p-6 border-b border-base-300">
            <h1 className="text-2xl font-bold">
              Sentinel Fraud
            </h1>

            <p className="text-sm text-base-content/60 mt-1">
              Intelligence Platform
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/dashboard"
              className={getNavClass(
                "/dashboard",
              )}
            >
              <LayoutDashboard size={18} />

              Dashboard
            </Link>

            <Link
              to="/transactions"
              className={getNavClass(
                "/transactions",
              )}
            >
              <BarChart3 size={18} />

              Transactions
            </Link>

            <Link
              to="/review-queue"
              className={getNavClass(
                "/review-queue",
              )}
            >
              <ShieldAlert size={18} />

              Review Queue
            </Link>

            <Link
              to="/audit-logs"
              className={getNavClass(
                "/audit-logs",
              )}
            >
              <FileWarning size={18} />

              Audit Logs
            </Link>
          </nav>
        </aside>
      </div>
    </div>
  )
}