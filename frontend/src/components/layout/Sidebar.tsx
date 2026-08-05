import { NavLink } from 'react-router-dom'
import { Coffee, X } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { getNavForRole } from '@/features/navigation/navConfig'
import { RoleBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useApp()
  const items = getNavForRole(role)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-black/8 px-4 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white">
            <Coffee className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold leading-tight">Cafe Dx3</p>
            <p className="truncate text-[11px] text-muted">ERP & POS</p>
          </div>
        </div>
        {onNavigate ? (
          <Button variant="ghost" size="sm" className="md:hidden" onClick={onNavigate}>
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      {role ? (
        <div className="px-4 pt-3">
          <RoleBadge role={role} />
        </div>
      ) : null}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split('/').length <= 2}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-700 text-white'
                  : 'text-ink/80 hover:bg-black/[0.04]',
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <p className="border-t border-black/8 px-4 py-3 text-[11px] text-muted">
        Foundation v0.1 · Skeleton ready
      </p>
    </div>
  )
}
