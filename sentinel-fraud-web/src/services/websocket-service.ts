import toast from "react-hot-toast"

import { QueryClient } from "@tanstack/react-query"

import { useNotificationStore } from "../store/notification-store"

import type { RealtimeNotification } from "../types/notification"


class WebSocketService {
  private websocket: WebSocket | null =
    null

  connect(
    token: string,
    queryClient: QueryClient,
  ) {
    if (
      this.websocket &&
      (
        this.websocket.readyState ===
          WebSocket.OPEN ||
        this.websocket.readyState ===
          WebSocket.CONNECTING
      )
    ) {
      return
    }

    this.websocket =
      new WebSocket(
        `ws://127.0.0.1:8000/notifications/ws?token=${token}`,
      )

    this.websocket.onopen = () => {
      console.log(
        "[WebSocket] Connected",
      )
    }

    this.websocket.onmessage = (
      event,
    ) => {
      const notification: RealtimeNotification =
        JSON.parse(
          event.data,
        )

      this.handleNotification(
        notification,
        queryClient,
      )
    }

    this.websocket.onclose = () => {
      console.log(
        "[WebSocket] Disconnected",
      )
    }

    this.websocket.onerror = (
      error,
    ) => {
      console.error(
        "[WebSocket] Error",
        error,
      )
    }
  }

  disconnect() {
    if (
      this.websocket &&
      this.websocket.readyState ===
        WebSocket.OPEN
    ) {
      this.websocket.close()
    }

    this.websocket = null
  }

  private handleNotification(
    notification: RealtimeNotification,
    queryClient: QueryClient,
  ) {
    useNotificationStore
      .getState()
      .addNotification(
        notification,
      )

    switch (
      notification.severity
    ) {
      case "SUCCESS":
        toast.success(
          notification.title,
        )
        break

      case "WARNING":
        toast(
          notification.title,
          {
            icon: "⚠️",
          },
        )
        break

      case "CRITICAL":
        toast.error(
          notification.title,
        )
        break
    }

    queryClient.invalidateQueries()

    console.log(
      "[Realtime Notification]",
      notification,
    )
  }
}


export const websocketService =
  new WebSocketService()