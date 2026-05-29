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

import type { ReactNode } from "react"

import { NotificationDrawer } from "../components/notifications/NotificationDrawer"

import { ThemeToggle } from "../components/theme-toggle"

import { useAuthStore } from "../store/auth-store"

import type { UserRole } from "../types/auth"


interface DashboardLayoutProps {
  children: ReactNode
}


interface NavItem {
  path: string

  label: string

  icon: ReactNode

  allowedRoles: UserRole[]
}


const navItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    allowedRoles: [
      "ADMIN",
      "ANALYST",
      "OPERATOR",
    ],
  },
  {
    path: "/transactions",
    label: "Transactions",
    icon: <BarChart3 size={18} />,
    allowedRoles: [
      "ADMIN",
      "ANALYST",
    ],
  },
  {
    path: "/review-queue",
    label: "Review Queue",
    icon: <ShieldAlert size={18} />,
    allowedRoles: [
      "ADMIN",
      "ANALYST",
    ],
  },
  {
    path: "/audit-logs",
    label: "Audit Logs",
    icon: <FileWarning size={18} />,
    allowedRoles: [
      "ADMIN",
      "ANALYST",
    ],
  },
]


export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const navigate = useNavigate()

  const location = useLocation()

  const logout = useAuthStore(
    (state) => state.logout,
  )

  const currentUser = useAuthStore(
    (state) =>
      state.currentUser,
  )

  const role =
    currentUser?.role

  const visibleNavItems =
    navItems.filter((item) =>
      role
        ? item.allowedRoles.includes(
            role,
          )
        : false,
    )

  const canUseNotifications =
    role === "ADMIN"
    || role === "ANALYST"

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

      <div className="drawer-content flex min-h-screen flex-col bg-base-200">
        <header className="h-16 border-b border-base-300 bg-base-100 px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost btn-circle lg:hidden"
            >
              <Menu size={22} />
            </label>

            <h2 className="text-base font-semibold leading-tight sm:hidden">
              Anti-Fraud Ops Center
            </h2>

            <h2 className="hidden text-lg font-semibold sm:block">
              Anti-Fraud Operations Center
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {role ? (
              <span className="badge badge-outline">
                {role}
              </span>
            ) : null}

            {canUseNotifications ? (
              <NotificationDrawer />
            ) : null}

            <ThemeToggle />

            <button
              className="btn btn-ghost btn-circle"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="dashboard-drawer"
          className="drawer-overlay"
        />

        <aside className="w-72 min-h-full border-r border-base-300 bg-base-100 flex flex-col">
          <div className="border-b border-base-300 p-6">
            <h1 className="text-2xl font-bold">
              Sentinel Fraud
            </h1>

            <p className="mt-1 text-sm text-base-content/60">
              Intelligence Platform
            </p>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {visibleNavItems.map(
              (item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getNavClass(
                    item.path,
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </aside>
      </div>
    </div>
  )
}
