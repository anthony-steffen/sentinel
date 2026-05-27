import { create } from "zustand"

import type { RealtimeNotification } from "../types/notification"


interface NotificationState {
  notifications: RealtimeNotification[]

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
    return JSON.parse(
      stored,
    ) as RealtimeNotification[]

  } catch {
    return []
  }
}


const persistedNotifications =
  loadNotifications()


export const useNotificationStore =
  create<NotificationState>(
    (set) => ({
      notifications:
        persistedNotifications,

      unreadCount:
        persistedNotifications.length,

      addNotification: (
        notification,
      ) => {
        set((state) => {
          const notifications = [
            notification,
            ...state.notifications,
          ].slice(
            0,
            100,
          )

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              notifications,
            ),
          )

          return {
            notifications,

            unreadCount:
              state.unreadCount +
              1,
          }
        })
      },

      markAllAsRead: () => {
        set({
          unreadCount: 0,
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