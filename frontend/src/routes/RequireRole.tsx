import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { hasAnyPermission, type Permission } from '@/features/auth/types'

interface GuardProps {
  permissions?: Permission[]
  children?: React.ReactNode
}

/** Route guard — redirects to role select or not-authorized. */
export function RequireRole({ permissions, children }: GuardProps) {
  const { role } = useApp()
  const location = useLocation()

  if (!role) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  if (permissions && permissions.length > 0 && !hasAnyPermission(role, permissions)) {
    return <Navigate to="/not-authorized" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
