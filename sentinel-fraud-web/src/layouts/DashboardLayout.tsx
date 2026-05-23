import {
  BarChart3,
  FileWarning,
  LayoutDashboard,
  Menu,
  ShieldAlert,
} from "lucide-react"

import { Link } from "react-router-dom"

import { ThemeToggle } from "../components/theme-toggle"


interface DashboardLayoutProps {
  children: React.ReactNode
}


export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
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

          <ThemeToggle />
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
              className="btn btn-ghost justify-start w-full"
            >
              <LayoutDashboard size={18} />

              Dashboard
            </Link>

            <Link
              to="/transactions"
              className="btn btn-ghost justify-start w-full"
            >
              <BarChart3 size={18} />

              Transactions
            </Link>

            <Link
              to="/review-queue"
              className="btn btn-ghost justify-start w-full"
            >
              <ShieldAlert size={18} />

              Review Queue
            </Link>

            <Link
              to="/audit-logs"
              className="btn btn-ghost justify-start w-full"
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