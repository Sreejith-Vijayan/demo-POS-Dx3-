import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, User } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/Button'
import { RoleBadge } from '@/components/ui/Badge'
import { hasPermission } from '@/features/auth/types'
import { titleCase } from '@/utils/cn'

function pageTitle(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  if (!parts.length) return 'Role Selection'
  return titleCase(parts[parts.length - 1])
}

export function Topbar() {
  const { role, userName, toggleSidebar, clearRole } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const title = useMemo(() => pageTitle(location.pathname), [location.pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-black/8 bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleSidebar} aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="truncate text-[11px] text-muted">{location.pathname}</p>
        </div>

        {role ? <RoleBadge role={role} /> : null}

        {hasPermission(role, 'view_notifications') ? (
          <Button
            variant="ghost"
            size="sm"
            aria-label="Notifications"
            onClick={() => navigate('/dashboard/notifications')}
          >
            <Bell className="h-5 w-5" />
          </Button>
        ) : null}

        <div className="relative">
          <Button variant="outline" size="sm" onClick={() => setProfileOpen((o) => !o)}>
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{userName}</span>
          </Button>
          {profileOpen ? (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-black/10 bg-white p-2 shadow-lg">
              <p className="px-2 py-1 text-xs text-muted">Signed in as</p>
              <p className="px-2 pb-2 text-sm font-medium">{userName}</p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  clearRole()
                  setProfileOpen(false)
                  navigate('/')
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
