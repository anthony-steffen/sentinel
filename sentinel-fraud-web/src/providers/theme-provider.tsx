import { useEffect } from "react"

import { useThemeStore } from "../store/theme-store"


interface ThemeProviderProps {
  children: React.ReactNode
}


export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const theme = useThemeStore(
    (state) => state.theme,
  )

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme,
    )
  }, [theme])

  return children
}