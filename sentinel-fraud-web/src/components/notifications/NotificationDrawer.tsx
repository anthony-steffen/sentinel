import { Bell } from "lucide-react"

import { useState } from "react"

import { useNotificationStore } from "../../store/notification-store"


export function NotificationDrawer() {
  const [open, setOpen] =
    useState(
      false,
    )

  const notifications =
    useNotificationStore(
      (state) =>
        state.notifications,
    )

  const markAllAsRead =
    useNotificationStore(
      (state) =>
        state.markAllAsRead,
    )

  const unreadCount =
    notifications.filter(
      (
        notification,
      ) => !notification.read,
    ).length

  function handleOpen() {
    setOpen(
      !open,
    )

    markAllAsRead()
  }

  return (
    <div className="dropdown dropdown-end">
      <button
        className="btn btn-ghost btn-circle"
        onClick={handleOpen}
      >
        <div className="indicator">
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="badge badge-sm badge-error indicator-item">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="mt-3 z-[100] card card-compact dropdown-content w-96 bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">
                Notifications
              </h3>

              <span className="text-sm text-base-content/60">
                {notifications.length}
                {" "}
                total
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {notifications.length ===
              0 ? (
                <div className="text-center py-8 text-base-content/60">
                  No notifications
                </div>
              ) : (
                notifications.map(
                  (
                    notification,
                  ) => (
                    <div
                      key={
                        notification.id
                      }
                      className={`p-3 rounded-xl border ${
                        notification.read
                          ? "bg-base-200 border-base-300"
                          : "bg-base-100 border-primary"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold">
                            {
                              notification.title
                            }
                          </h4>

                          <p className="text-sm text-base-content/70 mt-1">
                            {
                              notification.message
                            }
                          </p>
                        </div>

                        <div
                          className={`badge ${
                            notification.severity ===
                            "CRITICAL"
                              ? "badge-error"
                              : notification.severity ===
                                  "WARNING"
                                ? "badge-warning"
                                : "badge-success"
                          }`}
                        >
                          {
                            notification.severity
                          }
                        </div>
                      </div>

                      <p className="text-xs text-base-content/50 mt-3">
                        {new Date(
                          notification.createdAt,
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  ),
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}