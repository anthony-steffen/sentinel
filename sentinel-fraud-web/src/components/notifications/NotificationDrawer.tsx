import {
  Bell,
  Trash2,
} from "lucide-react"

import { motion } from "framer-motion"

import { useNotificationStore } from "../../store/notification-store"

import { formatDateTime } from "../../utils/formatters"

import type { NotificationSeverity } from "../../types/notification"


function getSeverityClassName(
  severity: NotificationSeverity,
) {
  if (severity === "CRITICAL") {
    return "badge-error"
  }

  if (severity === "WARNING") {
    return "badge-warning"
  }

  if (severity === "INFO") {
    return "badge-info"
  }

  return "badge-success"
}


export function NotificationDrawer() {
  const notifications =
    useNotificationStore(
      (state) =>
        state.notifications,
    )

  const unreadCount =
    useNotificationStore(
      (state) =>
        state.unreadCount,
    )

  const markAllAsRead =
    useNotificationStore(
      (state) =>
        state.markAllAsRead,
    )

  const clearNotifications =
    useNotificationStore(
      (state) =>
        state.clearNotifications,
    )

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="btn btn-ghost btn-circle relative"
        onClick={
          markAllAsRead
        }
        title="Notifications"
      >
        <Bell size={20} />

        {unreadCount > 0 ? (
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 20,
            }}
            className="badge badge-error badge-sm absolute -top-1 -right-1"
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </motion.div>
        ) : null}
      </button>

      <div
        tabIndex={0}
        className="dropdown-content z-[100] mt-3 w-[360px] rounded-2xl border border-base-300 bg-base-100 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-base-300 p-4">
          <h3 className="text-lg font-semibold">
            Notifications
          </h3>

          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={
              clearNotifications
            }
            title="Clear notifications"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-base-content/60">
              No notifications
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {notifications.map(
                (item) => (
                  <motion.div
                    key={
                      item.payload.id
                    }
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className={`rounded-xl border p-4 ${
                      item.read
                        ? "border-base-300 bg-base-200"
                        : "border-primary/30 bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">
                          {
                            item.payload
                              .title
                          }
                        </h4>

                        <p className="mt-1 text-sm text-base-content/70">
                          {
                            item.payload
                              .message
                          }
                        </p>

                        <p className="mt-2 text-xs text-base-content/50">
                          {formatDateTime(
                            item.payload
                              .created_at,
                          )}
                        </p>
                      </div>

                      <div
                        className={`badge ${getSeverityClassName(item.payload.severity)}`}
                      >
                        {
                          item.payload
                            .severity
                        }
                      </div>
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
