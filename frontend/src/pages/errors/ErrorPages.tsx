import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ShieldAlert, SearchX } from 'lucide-react'

export function NotAuthorizedPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="font-display text-2xl font-semibold">Not authorized</h1>
      <p className="max-w-sm text-sm text-muted">
        Your selected role does not have permission for this page.
      </p>
      <div className="flex gap-2">
        <Link to="/"><Button variant="outline">Change role</Button></Link>
        <Link to="/dashboard"><Button>Dashboard</Button></Link>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        <SearchX className="h-7 w-7" />
      </div>
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">The route you requested does not exist.</p>
      <Link to="/"><Button>Go home</Button></Link>
    </div>
  )
}
