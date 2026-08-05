import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function DataTable({
  columns,
  rows,
  empty,
}: {
  columns: { key: string; label: string; className?: string }[]
  rows: Record<string, ReactNode>[]
  empty?: string
}) {
  if (!rows.length) {
    return <EmptyState title={empty ?? 'No data'} />
  }

  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/10 text-xs uppercase tracking-wide text-muted">
            {columns.map((c) => (
              <th key={c.key} className={cn('whitespace-nowrap px-3 py-2 font-medium', c.className)}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-black/5 last:border-0">
              {columns.map((c) => (
                <td key={c.key} className={cn('whitespace-nowrap px-3 py-3', c.className)}>
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/60 px-4 py-12 text-center">
      <p className="font-medium">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-black/5" />
      ))}
    </div>
  )
}

export function LoadingPage({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}
