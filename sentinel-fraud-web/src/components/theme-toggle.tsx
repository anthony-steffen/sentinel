import { Moon, Sun } from "lucide-react"

import { useThemeStore } from "../store/theme-store"


export function ThemeToggle() {
  const theme = useThemeStore(
    (state) => state.theme,
  )

  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme,
  )

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
    >
      {theme === "lofi" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  )
}