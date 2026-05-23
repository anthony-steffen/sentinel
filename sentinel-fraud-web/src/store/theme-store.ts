import { create } from "zustand"

type Theme = "lofi" | "dark"

interface ThemeStore {
  theme: Theme

  toggleTheme: () => void

  setTheme: (theme: Theme) => void
}

const getInitialTheme = (): Theme => {
  const storedTheme = localStorage.getItem(
    "sentinel-theme",
  ) as Theme | null

  if (storedTheme) {
    return storedTheme
  }

  return "dark"
}

export const useThemeStore = create<ThemeStore>(
  (set) => ({
    theme: getInitialTheme(),

    toggleTheme: () =>
      set((state) => {
        const newTheme =
          state.theme === "dark"
            ? "lofi"
            : "dark"

        localStorage.setItem(
          "sentinel-theme",
          newTheme,
        )

        document.documentElement.setAttribute(
          "data-theme",
          newTheme,
        )

        return {
          theme: newTheme,
        }
      }),

    setTheme: (theme) => {
      localStorage.setItem(
        "sentinel-theme",
        theme,
      )

      document.documentElement.setAttribute(
        "data-theme",
        theme,
      )

      set({
        theme,
      })
    },
  }),
)