import { useEffect } from "react"

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query"

import { Toaster } from "react-hot-toast"

import { ThemeProvider } from "./providers/theme-provider"

import { AppRoutes } from "./routes"

import { websocketService } from "./services/websocket-service"

import { useAuthStore } from "./store/auth-store"


const queryClient =
  new QueryClient()


function RealtimeProvider() {
  const queryClient =
    useQueryClient()

  const accessToken =
    useAuthStore(
      (state) =>
        state.accessToken,
    )

  useEffect(() => {
    if (!accessToken) {
      websocketService.disconnect()

      return
    }

    websocketService.connect(
      accessToken,
      queryClient,
    )
  }, [
    accessToken,
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

        <RealtimeProvider />

        <AppRoutes />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App