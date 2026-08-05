/** Role & permission enums — mirrors backend RBAC. */

export type Role =
  | 'administrator'
  | 'manager'
  | 'captain'
  | 'kitchen'
  | 'cashier'
  | 'customer'

export type Permission =
  | 'view_dashboard'
  | 'view_sales'
  | 'take_orders'
  | 'modify_orders'
  | 'view_orders'
  | 'send_kot'
  | 'cancel_orders'
  | 'view_kot'
  | 'update_kot_status'
  | 'generate_bill'
  | 'receive_payment'
  | 'print_receipt'
  | 'view_payments'
  | 'view_inventory'
  | 'modify_inventory'
  | 'view_reports'
  | 'view_employees'
  | 'manage_employees'
  | 'view_customers'
  | 'manage_customers'
  | 'view_menu'
  | 'manage_menu'
  | 'view_settings'
  | 'manage_settings'
  | 'view_notifications'
  | 'view_feedback'
  | 'submit_feedback'
  | 'view_tables'
  | 'manage_tables'
  | 'full_access'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  administrator: ['full_access'],
  manager: [
    'view_dashboard',
    'view_sales',
    'view_orders',
    'view_kot',
    'view_inventory',
    'modify_inventory',
    'view_reports',
    'view_employees',
    'manage_employees',
    'view_customers',
    'manage_customers',
    'view_menu',
    'manage_menu',
    'view_settings',
    'view_notifications',
    'view_feedback',
    'view_tables',
    'view_payments',
  ],
  captain: [
    'view_dashboard',
    'take_orders',
    'modify_orders',
    'view_orders',
    'send_kot',
    'view_menu',
    'view_tables',
    'manage_tables',
    'view_notifications',
  ],
  kitchen: [
    'view_dashboard',
    'view_kot',
    'update_kot_status',
    'view_orders',
    'view_notifications',
  ],
  cashier: [
    'view_dashboard',
    'view_orders',
    'generate_bill',
    'receive_payment',
    'print_receipt',
    'view_payments',
    'view_menu',
    'view_customers',
    'view_notifications',
    'view_tables',
  ],
  customer: ['view_menu', 'submit_feedback', 'view_feedback'],
}

export const ROLE_LABELS: Record<Role, string> = {
  administrator: 'Administrator',
  manager: 'Manager',
  captain: 'Captain',
  kitchen: 'Kitchen Staff',
  cashier: 'Cashier',
  customer: 'Customer',
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  administrator: 'Full system access across all modules',
  manager: 'Dashboard, reports, inventory & team',
  captain: 'Tables, orders & KOT',
  kitchen: 'Kitchen display & order status',
  cashier: 'Billing, payments & receipts',
  customer: 'QR menu & feedback',
}

export function hasPermission(role: Role | null, permission: Permission): boolean {
  if (!role) return false
  const perms = ROLE_PERMISSIONS[role] ?? []
  if (perms.includes('full_access')) return true
  return perms.includes(permission)
}

export function hasAnyPermission(role: Role | null, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

export const STORAGE_ROLE_KEY = 'cafe_erp_role'
export const STORAGE_THEME_KEY = 'cafe_erp_theme'
