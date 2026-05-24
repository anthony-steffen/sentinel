import { ThemeProvider } from "./providers/theme-provider"
import { QueryProvider } from "./providers/query-provider"

import { AppRoutes } from "./routes"


function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App