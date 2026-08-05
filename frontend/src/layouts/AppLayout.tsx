import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { Drawer } from '@/components/ui/Overlays'
import { useApp } from '@/context/AppContext'

export function AppLayout() {
  const { sidebarOpen, setSidebarOpen } = useApp()

  return (
    <div className="flex min-h-dvh bg-[linear-gradient(180deg,#f3faf6_0%,#f7f5f1_28%,#f7f5f1_100%)]">
      <aside className="hidden w-64 shrink-0 border-r border-black/8 bg-white/70 md:block">
        <Sidebar />
      </aside>

      <Drawer open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="safe-pb flex-1 overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function PageLayout({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  )
}
