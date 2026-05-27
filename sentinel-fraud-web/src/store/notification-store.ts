import { create } from "zustand"

import type { RealtimeNotification } from "../types/notification"


interface NotificationItem
  extends RealtimeNotification {
  id: string

  createdAt: string

  read: boolean
}


interface NotificationState {
  notifications: NotificationItem[]

  addNotification: (
    notification: RealtimeNotification,
  ) => void

  markAllAsRead: () => void
}


export const useNotificationStore =
  create<NotificationState>(
    (set) => ({
      notifications: [],

      addNotification: (
        notification,
      ) => {
        set((state) => ({
          notifications: [
            {
              ...notification,

              id:
                crypto.randomUUID(),

              createdAt:
                new Date().toISOString(),

              read: false,
            },

            ...state.notifications,
          ],
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications:
            state.notifications.map(
              (
                notification,
              ) => ({
                ...notification,

                read: true,
              }),
            ),
        }))
      },
    }),
  )