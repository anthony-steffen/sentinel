import toast from "react-hot-toast"

import { QueryClient } from "@tanstack/react-query"

import { useNotificationStore } from "../store/notification-store"

import { useRealtimeStore } from "../store/realtime-store"

import type { RealtimeNotification } from "../types/notification"


class WebSocketService {
  private websocket: WebSocket | null =
    null

  private reconnectTimeout:
    | number
    | null = null

  private invalidateTimeout:
    | number
    | null = null

  private reconnectAttempts = 0

  private readonly maxReconnectAttempts =
    5

  private token: string | null =
    null

  private queryClient: QueryClient | null =
    null

  connect(
    token: string,
    queryClient: QueryClient,
  ) {
    this.token = token

    this.queryClient =
      queryClient

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

    useRealtimeStore
      .getState()
      .setStatus(
        "CONNECTING",
      )

    this.websocket =
      new WebSocket(
        `ws://127.0.0.1:8000/notifications/ws?token=${token}`,
      )

    this.websocket.onopen = () => {
      console.log(
        "[WebSocket] Connected",
      )

      useRealtimeStore
        .getState()
        .setStatus(
          "CONNECTED",
        )

      this.reconnectAttempts = 0
    }

    this.websocket.onmessage = (
      event,
    ) => {
      const data = JSON.parse(
        event.data,
      )

      if (
        data.type === "PING"
      ) {
        console.log(
          "[WebSocket] Ping received",
        )

        return
      }

      this.handleNotification(
        data,
      )
    }

    this.websocket.onclose = () => {
      console.log(
        "[WebSocket] Disconnected",
      )

      useRealtimeStore
        .getState()
        .setStatus(
          "DISCONNECTED",
        )

      this.tryReconnect()
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
      this.reconnectTimeout
    ) {
      clearTimeout(
        this.reconnectTimeout,
      )
    }

    if (
      this.invalidateTimeout
    ) {
      clearTimeout(
        this.invalidateTimeout,
      )
    }

    if (
      this.websocket &&
      (
        this.websocket.readyState ===
          WebSocket.OPEN ||
        this.websocket.readyState ===
          WebSocket.CONNECTING
      )
    ) {
      this.websocket.close()
    }

    this.websocket = null

    useRealtimeStore
      .getState()
      .setStatus(
        "DISCONNECTED",
      )
  }

  private tryReconnect() {
    if (
      this.reconnectAttempts >=
      this.maxReconnectAttempts
    ) {
      console.error(
        "[WebSocket] Max reconnect attempts reached",
      )

      return
    }

    if (
      !this.token ||
      !this.queryClient
    ) {
      return
    }

    this.reconnectAttempts += 1

    useRealtimeStore
      .getState()
      .setStatus(
        "CONNECTING",
      )

    console.log(
      `[WebSocket] Reconnecting (${this.reconnectAttempts})...`,
    )

    this.reconnectTimeout =
      window.setTimeout(
        () => {
          this.connect(
            this.token!,
            this.queryClient!,
          )
        },
        3000,
      )
  }

  private debounceInvalidateQueries() {
    if (
      this.invalidateTimeout
    ) {
      clearTimeout(
        this.invalidateTimeout,
      )
    }

    this.invalidateTimeout =
      window.setTimeout(
        () => {
          this.queryClient?.invalidateQueries()

          console.log(
            "[React Query] Cache invalidated",
          )
        },
        1000,
      )
  }

  private lastToastTimestamp =
  0

private handleNotification(
  notification: RealtimeNotification,
) {
  useNotificationStore
    .getState()
    .addNotification(
      notification,
    )

    const now =
      Date.now()

    const canShowToast =
      now -
        this
          .lastToastTimestamp >
      1500

    if (canShowToast) {
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

      this.lastToastTimestamp =
        now
    }

    this.debounceInvalidateQueries()

    console.log(
      "[Realtime Notification]",
      notification,
    )
  }
}


export const websocketService =
  new WebSocketService()