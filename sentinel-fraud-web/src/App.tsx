import { ThemeProvider } from "./providers/theme-provider"

import { AppRoutes } from "./routes"


function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App