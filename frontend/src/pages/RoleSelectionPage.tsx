import { useNavigate } from 'react-router-dom'
import {
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  type Role,
} from '@/features/auth/types'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Coffee, Shield, Utensils, ChefHat, Receipt, UserRound } from 'lucide-react'
import { cn } from '@/utils/cn'

const ROLES: { role: Role; icon: typeof Coffee; home: string }[] = [
  { role: 'administrator', icon: Shield, home: '/dashboard' },
  { role: 'manager', icon: Coffee, home: '/dashboard' },
  { role: 'captain', icon: Utensils, home: '/captain' },
  { role: 'kitchen', icon: ChefHat, home: '/kitchen' },
  { role: 'cashier', icon: Receipt, home: '/cashier' },
  { role: 'customer', icon: UserRound, home: '/menu' },
]

export function RoleSelectionPage() {
  const { setRole, role } = useApp()
  const navigate = useNavigate()

  const select = (r: Role, home: string) => {
    setRole(r)
    navigate(home)
  }

  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top,#e4f5eb,transparent_55%),linear-gradient(180deg,#f7f5f1,#ebe7df)] px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-700/20">
            <Coffee className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Cafe Dx3
          </h1>
          <p className="mt-2 text-sm text-muted sm:text-base">
            Select a role to explore the ERP & POS foundation
          </p>
          {role ? (
            <p className="mt-2 text-xs text-brand-800">
              Current role: <strong>{ROLE_LABELS[role]}</strong>
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {ROLES.map(({ role: r, icon: Icon, home }) => (
            <button
              key={r}
              type="button"
              onClick={() => select(r, home)}
              className={cn(
                'text-left transition active:scale-[0.99]',
                role === r && 'ring-2 ring-brand-600 rounded-2xl',
              )}
            >
              <Card className="h-full hover:border-brand-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{ROLE_LABELS[r]}</p>
                    <p className="mt-1 text-sm text-muted">{ROLE_DESCRIPTIONS[r]}</p>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Demo mode — no login. Role is stored in localStorage and sent as X-User-Role.
        </p>
      </div>
    </div>
  )
}
