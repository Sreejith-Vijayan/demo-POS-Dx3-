import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  STORAGE_ROLE_KEY,
  STORAGE_THEME_KEY,
  type Role,
  ROLE_LABELS,
} from '@/features/auth/types'

type Theme = 'light' | 'dark'

interface AppState {
  role: Role | null
  setRole: (role: Role | null) => void
  clearRole: () => void
  userName: string
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  theme: Theme
  setTheme: (theme: Theme) => void
}

const AppContext = createContext<AppState | null>(null)

function readStoredRole(): Role | null {
  const raw = localStorage.getItem(STORAGE_ROLE_KEY)
  if (!raw) return null
  return raw as Role
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(() => readStoredRole())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(STORAGE_THEME_KEY) as Theme) || 'light',
  )

  const setRole = useCallback((next: Role | null) => {
    setRoleState(next)
    if (next) localStorage.setItem(STORAGE_ROLE_KEY, next)
    else localStorage.removeItem(STORAGE_ROLE_KEY)
  }, [])

  const clearRole = useCallback(() => setRole(null), [setRole])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem(STORAGE_THEME_KEY, next)
    document.documentElement.dataset.theme = next
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const value = useMemo<AppState>(
    () => ({
      role,
      setRole,
      clearRole,
      userName: role ? ROLE_LABELS[role] : 'Guest',
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar: () => setSidebarOpen((o) => !o),
      theme,
      setTheme,
    }),
    [role, setRole, clearRole, sidebarOpen, theme, setTheme],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
