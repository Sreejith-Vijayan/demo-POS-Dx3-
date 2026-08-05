import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { RequireRole } from '@/routes/RequireRole'
import { RoleSelectionPage } from '@/pages/RoleSelectionPage'
import { DashboardOverviewPage, DashboardSalesPage } from '@/pages/dashboard/DashboardPages'
import {
  CaptainHomePage,
  CaptainOrderPage,
  CaptainOrdersPage,
  CaptainTablesPage,
} from '@/pages/captain/CaptainPages'
import { KitchenHistoryPage, KitchenHomePage, KitchenKotPage } from '@/pages/kitchen/KitchenPages'
import {
  CashierBillingPage,
  CashierHistoryPage,
  CashierHomePage,
  CashierPaymentsPage,
} from '@/pages/cashier/CashierPages'
import { MenuCategoriesPage, MenuItemPage, MenuPage } from '@/pages/menu/MenuPages'
import {
  CustomersPage,
  EmployeesPage,
  FeedbackPage,
  InventoryPage,
  NotificationsPage,
  ReportsPage,
  SettingsPage,
} from '@/pages/modules/ModulePages'
import { NotAuthorizedPage, NotFoundPage } from '@/pages/errors/ErrorPages'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />
      <Route path="/not-authorized" element={<NotAuthorizedPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />

      <Route element={<RequireRole />}>
        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<RequireRole permissions={['view_dashboard']}><DashboardOverviewPage /></RequireRole>} />
          <Route path="/dashboard/overview" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard/sales" element={<RequireRole permissions={['view_sales']}><DashboardSalesPage /></RequireRole>} />
          <Route path="/dashboard/reports" element={<RequireRole permissions={['view_reports']}><ReportsPage /></RequireRole>} />
          <Route path="/dashboard/settings" element={<RequireRole permissions={['view_settings']}><SettingsPage /></RequireRole>} />
          <Route path="/dashboard/inventory" element={<RequireRole permissions={['view_inventory']}><InventoryPage /></RequireRole>} />
          <Route path="/dashboard/employees" element={<RequireRole permissions={['view_employees']}><EmployeesPage /></RequireRole>} />
          <Route path="/dashboard/customers" element={<RequireRole permissions={['view_customers']}><CustomersPage /></RequireRole>} />
          <Route path="/dashboard/notifications" element={<RequireRole permissions={['view_notifications']}><NotificationsPage /></RequireRole>} />

          {/* Captain */}
          <Route path="/captain" element={<RequireRole permissions={['view_dashboard']}><CaptainHomePage /></RequireRole>} />
          <Route path="/captain/tables" element={<RequireRole permissions={['view_tables']}><CaptainTablesPage /></RequireRole>} />
          <Route path="/captain/order" element={<RequireRole permissions={['take_orders']}><CaptainOrderPage /></RequireRole>} />
          <Route path="/captain/orders" element={<RequireRole permissions={['view_orders']}><CaptainOrdersPage /></RequireRole>} />

          {/* Kitchen */}
          <Route path="/kitchen" element={<RequireRole permissions={['view_dashboard']}><KitchenHomePage /></RequireRole>} />
          <Route path="/kitchen/kot" element={<RequireRole permissions={['view_kot']}><KitchenKotPage /></RequireRole>} />
          <Route path="/kitchen/history" element={<RequireRole permissions={['view_kot']}><KitchenHistoryPage /></RequireRole>} />

          {/* Cashier */}
          <Route path="/cashier" element={<RequireRole permissions={['view_dashboard']}><CashierHomePage /></RequireRole>} />
          <Route path="/cashier/billing" element={<RequireRole permissions={['generate_bill']}><CashierBillingPage /></RequireRole>} />
          <Route path="/cashier/payments" element={<RequireRole permissions={['view_payments']}><CashierPaymentsPage /></RequireRole>} />
          <Route path="/cashier/history" element={<RequireRole permissions={['view_payments']}><CashierHistoryPage /></RequireRole>} />

          {/* Menu / shared */}
          <Route path="/menu" element={<RequireRole permissions={['view_menu']}><MenuPage /></RequireRole>} />
          <Route path="/menu/categories" element={<RequireRole permissions={['view_menu']}><MenuCategoriesPage /></RequireRole>} />
          <Route path="/menu/item/:id" element={<RequireRole permissions={['view_menu']}><MenuItemPage /></RequireRole>} />

          <Route path="/settings" element={<RequireRole permissions={['view_settings']}><SettingsPage /></RequireRole>} />
          <Route path="/reports" element={<RequireRole permissions={['view_reports']}><ReportsPage /></RequireRole>} />
          <Route path="/inventory" element={<RequireRole permissions={['view_inventory']}><InventoryPage /></RequireRole>} />
          <Route path="/employees" element={<RequireRole permissions={['view_employees']}><EmployeesPage /></RequireRole>} />
          <Route path="/customers" element={<RequireRole permissions={['view_customers']}><CustomersPage /></RequireRole>} />
          <Route path="/feedback" element={<RequireRole permissions={['submit_feedback', 'view_feedback']}><FeedbackPage /></RequireRole>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
