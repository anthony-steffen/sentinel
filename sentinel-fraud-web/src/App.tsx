import { ThemeProvider } from "./providers/theme-provider"

import { LoginPage } from "./pages/LoginPage"


function App() {
  return (
    <ThemeProvider>
      <LoginPage />
    </ThemeProvider>
  )
}

export default App