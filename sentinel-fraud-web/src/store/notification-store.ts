import { create } from "zustand"

import type { RealtimeNotification } from "../types/notification"


interface StoredNotification {
  read: boolean

  payload: RealtimeNotification
}


interface NotificationState {
  notifications: StoredNotification[]

  unreadCount: number

  addNotification: (
    notification: RealtimeNotification,
  ) => void

  markAllAsRead: () => void

  clearNotifications: () => void
}


const STORAGE_KEY =
  "sentinel-notifications"


function loadNotifications() {
  const stored =
    localStorage.getItem(
      STORAGE_KEY,
    )

  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(
      stored,
    ) as StoredNotification[]

    return parsed.filter(
      (item) =>
        Boolean(
          item?.payload?.id,
        ),
    )

  } catch {
    return []
  }
}


function saveNotifications(
  notifications: StoredNotification[],
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      notifications,
    ),
  )
}


const persistedNotifications =
  loadNotifications()


export const useNotificationStore =
  create<NotificationState>(
    (set) => ({
      notifications:
        persistedNotifications,

      unreadCount:
        persistedNotifications.filter(
          (item) =>
            !item.read,
        ).length,

      addNotification: (
        notification,
      ) => {
        set((state) => {
          const notifications = [
            {
              read: false,
              payload:
                notification,
            },
            ...state.notifications,
          ].slice(
            0,
            100,
          )

          saveNotifications(
            notifications,
          )

          return {
            notifications,
            unreadCount:
              notifications.filter(
                (item) =>
                  !item.read,
              ).length,
          }
        })
      },

      markAllAsRead: () => {
        set((state) => {
          const notifications =
            state.notifications.map(
              (item) => ({
                ...item,
                read: true,
              }),
            )

          saveNotifications(
            notifications,
          )

          return {
            notifications,
            unreadCount: 0,
          }
        })
      },

      clearNotifications: () => {
        localStorage.removeItem(
          STORAGE_KEY,
        )

        set({
          notifications: [],
          unreadCount: 0,
        })
      },
    }),
  )
