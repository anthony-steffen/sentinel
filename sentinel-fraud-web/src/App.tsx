import { Toaster } from "react-hot-toast"

import { QueryProvider } from "./providers/query-provider"

import { ThemeProvider } from "./providers/theme-provider"

import { AppRoutes } from "./routes"


function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />

        <AppRoutes />
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App