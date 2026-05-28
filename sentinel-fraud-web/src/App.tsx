import { useEffect } from "react"

import {
  useQuery,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query"

import { Toaster } from "react-hot-toast"

import { ThemeProvider } from "./providers/theme-provider"

import { AppRoutes } from "./routes"

import { getCurrentUser } from "./services/auth-service"

import { websocketService } from "./services/websocket-service"

import { useAuthStore } from "./store/auth-store"


const queryClient =
  new QueryClient()

function AuthSessionProvider() {
  const accessToken =
    useAuthStore(
      (state) =>
        state.accessToken,
    )

  const setCurrentUser =
    useAuthStore(
      (state) =>
        state.setCurrentUser,
    )

  const setSessionResolved =
    useAuthStore(
      (state) =>
        state.setSessionResolved,
    )

  const logout = useAuthStore(
    (state) => state.logout,
  )

  const sessionQuery =
    useQuery({
      queryKey: [
        "auth-me",
      ],

      queryFn:
        getCurrentUser,

      enabled:
        Boolean(accessToken),

      retry: false,
    })

  useEffect(() => {
    if (!accessToken) {
      setCurrentUser(
        null,
      )

      setSessionResolved(
        true,
      )

      return
    }

    if (sessionQuery.isSuccess) {
      setCurrentUser(
        sessionQuery.data,
      )

      return
    }

    if (sessionQuery.isError) {
      logout()
    }
  }, [
    accessToken,
    logout,
    sessionQuery.data,
    sessionQuery.isError,
    sessionQuery.isSuccess,
    setCurrentUser,
    setSessionResolved,
  ])

  return null
}


function RealtimeProvider() {
  const queryClient =
    useQueryClient()

  const accessToken =
    useAuthStore(
      (state) =>
        state.accessToken,
    )

  const currentUser =
    useAuthStore(
      (state) =>
        state.currentUser,
    )

  const isSessionResolved =
    useAuthStore(
      (state) =>
        state.isSessionResolved,
    )

  useEffect(() => {
    if (
      !accessToken
      || !isSessionResolved
      || !currentUser
    ) {
      websocketService.disconnect()

      return
    }

    const canUseRealtime =
      currentUser.role ===
        "ADMIN"
      || currentUser.role ===
        "ANALYST"

    if (!canUseRealtime) {
      websocketService.disconnect()

      return
    }

    websocketService.connect(
      accessToken,
      queryClient,
    )
  }, [
    accessToken,
    currentUser,
    isSessionResolved,
    queryClient,
  ])

  return null
}


function App() {
  return (
    <QueryClientProvider
      client={queryClient}
    >
      <ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />

        <AuthSessionProvider />

        <RealtimeProvider />

        <AppRoutes />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
