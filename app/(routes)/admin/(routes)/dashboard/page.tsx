import { getDashboardStats, getRevenueData, getTopProducts, getRecentOrders } from '@/actions/dashboard';
import { DashboardClient } from "./dashboard-client";
import OopsMessage from '@/components/Others/OopsMessage';
import { requireAdmin } from '@/lib/auth-utils';

export const dynamic = "force-dynamic";

const AdminDashboardPage = async () => {
  const { isAuthorized, errorMessage } = await requireAdmin();
  
  if (!isAuthorized) {
    return <OopsMessage message={errorMessage?.message || "You are not authorized to view this page"} />;
  }

  try {
    const [stats, revenueData, topProducts, recentOrders] = await Promise.all([
      getDashboardStats(),
      getRevenueData(),
      getTopProducts(),
      getRecentOrders()
    ]);

    return (
      <DashboardClient 
        totalRevenue={stats.sales}
        salesCount={stats.orders}
        stockCount={stats.products}
        graphRevenue={revenueData}
        topProducts={topProducts}
        recentOrders={recentOrders}
      />
    );
  } catch (error) {
    console.error("[DASHBOARD_PAGE]", error);
    return <OopsMessage message="An error occurred while loading the dashboard. Please try again later." />;
  }
};

export default AdminDashboardPage;