import { cn } from '@/utils/cn'
import { titleCase } from '@/utils/cn'

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  occupied: 'bg-amber-100 text-amber-900',
  reserved: 'bg-sky-100 text-sky-800',
  billing: 'bg-orange-100 text-orange-900',
  pending: 'bg-slate-100 text-slate-700',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-amber-100 text-amber-900',
  ready: 'bg-emerald-100 text-emerald-800',
  served: 'bg-teal-100 text-teal-800',
  paid: 'bg-brand-100 text-brand-800',
  cancelled: 'bg-red-100 text-red-800',
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-slate-100 text-slate-600',
  completed: 'bg-brand-100 text-brand-800',
  new: 'bg-violet-100 text-violet-800',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium capitalize',
        STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-700',
        className,
      )}
    >
      {status}
    </span>
  )
}

export function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-800">
      {titleCase(role)}
    </span>
  )
}
