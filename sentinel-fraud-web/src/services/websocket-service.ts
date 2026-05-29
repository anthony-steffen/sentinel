import toast from "react-hot-toast"

import { QueryClient } from "@tanstack/react-query"

import { useNotificationStore } from "../store/notification-store"

import { useRealtimeStore } from "../store/realtime-store"

import type { RealtimeNotification } from "../types/notification"

const websocketProtocol =
  window.location.protocol ===
  "https:"
    ? "wss"
    : "ws"

const defaultWebsocketUrl =
  import.meta.env.PROD
    ? `${websocketProtocol}://${window.location.host}/notifications/ws`
    : "ws://127.0.0.1:8000/notifications/ws"

const websocketBaseUrl =
  resolveWebsocketBaseUrl()

function resolveWebsocketBaseUrl() {
  const configuredWebsocketUrl =
    import.meta.env.VITE_WS_BASE_URL?.trim()

  if (!configuredWebsocketUrl) {
    return defaultWebsocketUrl
  }

  const isPublicHost =
    !["localhost", "127.0.0.1"].includes(
      window.location.hostname,
    )

  const pointsToLocalhost =
    configuredWebsocketUrl.includes(
      "localhost",
    )
    || configuredWebsocketUrl.includes(
      "127.0.0.1",
    )

  if (
    isPublicHost &&
    pointsToLocalhost
  ) {
    return `${websocketProtocol}://${window.location.host}/notifications/ws`
  }

  return configuredWebsocketUrl
}


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

  private lastToastTimestamp = 0

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
        `${websocketBaseUrl}?token=${token}`,
      )

    this.websocket.onopen = () => {
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
      const parsedData =
        this.parseMessage(
          event.data,
        )

      if (!parsedData) {
        return
      }

      if (
        parsedData.type ===
        "PING"
      ) {
        return
      }

      if (
        !this.isRealtimeNotification(
          parsedData,
        )
      ) {
        return
      }

      this.handleNotification(
        parsedData,
      )
    }

    this.websocket.onclose = () => {
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

  private parseMessage(
    eventData: string,
  ) {
    try {
      return JSON.parse(
        eventData,
      ) as Record<
        string,
        unknown
      >
    } catch {
      return null
    }
  }

  private isRealtimeNotification(
    value: unknown,
  ): value is RealtimeNotification {
    if (
      typeof value !==
      "object"
      || value === null
    ) {
      return false
    }

    const candidate = value as Record<
      string,
      unknown
    >

    return (
      typeof candidate.id ===
        "string"
      && typeof candidate.type ===
        "string"
      && typeof candidate.severity ===
        "string"
      && typeof candidate.title ===
        "string"
      && typeof candidate.message ===
        "string"
      && typeof candidate.created_at ===
        "string"
      && typeof candidate.metadata ===
        "object"
      && candidate.metadata !== null
    )
  }

  private tryReconnect() {
    if (
      this.reconnectAttempts >=
      this.maxReconnectAttempts
    ) {
      useRealtimeStore
        .getState()
        .setStatus(
          "DISCONNECTED",
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
        },
        1000,
      )
  }

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
      if (
        notification.severity ===
        "CRITICAL"
      ) {
        toast.error(
          notification.title,
        )
      } else if (
        notification.severity ===
        "WARNING"
      ) {
        toast(
          notification.title,
          {
            icon: "!",
          },
        )
      } else if (
        notification.severity ===
        "INFO"
      ) {
        toast(
          notification.title,
        )
      } else {
        toast.success(
          notification.title,
        )
      }

      this.lastToastTimestamp =
        now
    }

    this.debounceInvalidateQueries()
  }
}


export const websocketService =
  new WebSocketService()
