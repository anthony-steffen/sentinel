import {
  Bell,
  Trash2,
} from "lucide-react"

import { motion } from "framer-motion"

import { useNotificationStore } from "../../store/notification-store"


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
      >
        <Bell size={20} />

        {unreadCount > 0 && (
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
            {unreadCount}
          </motion.div>
        )}
      </button>

      <div
        tabIndex={0}
        className="dropdown-content z-[100] mt-3 w-[360px] rounded-2xl border border-base-300 bg-base-100 shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h3 className="font-semibold text-lg">
            Notifications
          </h3>

          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={
              clearNotifications
            }
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {notifications.length ===
          0 ? (
            <div className="p-6 text-center text-base-content/60">
              No notifications
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map(
                (
                  notification,
                  index,
                ) => (
                  <motion.div
                    key={`${notification.title}-${index}`}
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
                    className="rounded-xl border border-base-300 bg-base-200 p-4"
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