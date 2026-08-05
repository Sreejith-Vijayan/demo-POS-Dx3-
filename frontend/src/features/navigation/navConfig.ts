import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  ChefHat,
  Receipt,
  Warehouse,
  BarChart3,
  Users,
  UserRound,
  Settings,
  Bell,
  MessageSquare,
  Table2,
  History,
  CreditCard,
  BookOpen,
} from 'lucide-react'
import type { Permission, Role } from '@/features/auth/types'
import { hasAnyPermission } from '@/features/auth/types'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  permissions?: Permission[]
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  administrator: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', path: '/dashboard/inventory', icon: Warehouse },
    { label: 'Reports', path: '/dashboard/reports', icon: BarChart3 },
    { label: 'Employees', path: '/dashboard/employees', icon: Users },
    { label: 'Customers', path: '/dashboard/customers', icon: UserRound },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  ],
  manager: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Sales', path: '/dashboard/sales', icon: BarChart3 },
    { label: 'Inventory', path: '/dashboard/inventory', icon: Warehouse },
    { label: 'Reports', path: '/dashboard/reports', icon: BarChart3 },
    { label: 'Employees', path: '/dashboard/employees', icon: Users },
    { label: 'Customers', path: '/dashboard/customers', icon: UserRound },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  ],
  captain: [
    { label: 'Dashboard', path: '/captain', icon: LayoutDashboard },
    { label: 'Tables', path: '/captain/tables', icon: Table2 },
    { label: 'New Order', path: '/captain/order', icon: ClipboardList },
    { label: 'Orders', path: '/captain/orders', icon: UtensilsCrossed },
  ],
  kitchen: [
    { label: 'Dashboard', path: '/kitchen', icon: LayoutDashboard },
    { label: 'KOT', path: '/kitchen/kot', icon: ChefHat },
    { label: 'History', path: '/kitchen/history', icon: History },
  ],
  cashier: [
    { label: 'Dashboard', path: '/cashier', icon: LayoutDashboard },
    { label: 'Billing', path: '/cashier/billing', icon: Receipt },
    { label: 'Payments', path: '/cashier/payments', icon: CreditCard },
    { label: 'History', path: '/cashier/history', icon: History },
  ],
  customer: [
    { label: 'QR Menu', path: '/menu', icon: BookOpen },
    { label: 'Feedback', path: '/feedback', icon: MessageSquare },
  ],
}

export function getNavForRole(role: Role | null): NavItem[] {
  if (!role) return []
  return NAV_BY_ROLE[role].filter(
    (item) => !item.permissions || hasAnyPermission(role, item.permissions),
  )
}
