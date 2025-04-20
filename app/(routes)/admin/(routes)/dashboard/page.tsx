import OopsMessage from '@/components/Others/OopsMessage';
import { requireAdmin } from '@/lib/auth-utils';
import { Container } from '@/components/ui/container';
import { CardStat } from '@/components/ui/card-stat';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { TopProducts } from '@/components/dashboard/top-products';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { getDashboardStats, getRevenueData, getTopProducts, getRecentOrders } from '@/actions/dashboard';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Users, ShoppingCart, DollarSign, Tags } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const { isAuthorized, errorMessage } = await requireAdmin();
  
  // If not authorized, show the OopsMessage
  if (!isAuthorized) {
    return errorMessage ? (
      <OopsMessage 
        message={errorMessage.message}
        title={errorMessage.title}
        backUrl={errorMessage.backUrl}
        backText={errorMessage.backText}
      />
    ) : null;
  }

  // Fetch dashboard data
  const [stats, revenueData, topProducts, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRevenueData(),
    getTopProducts(),
    getRecentOrders()
  ]);

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your store overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        <Link href="/admin/orders" className="col-span-1 xl:col-span-1 block">
          <CardStat
            title="Total Orders"
            value={stats.orders}
            description="All orders"
            icon={ShoppingCart}
            className="h-full"
          />
        </Link>
        <Link href="/admin/products" className="col-span-1 xl:col-span-1 block">
          <CardStat
            title="Products"
            value={stats.products}
            description="All products"
            icon={ShoppingBag}
            className="h-full"
          />
        </Link>
        <Link href="/admin/users" className="col-span-1 xl:col-span-1 block">
          <CardStat
            title="Customers"
            value={stats.users}
            description="Registered users"
            icon={Users}
            className="h-full"
          />
        </Link>
        <Link href="/admin/coupons" className="col-span-1 xl:col-span-1 block">
          <CardStat
            title="Coupons"
            value={stats.coupons}
            description="Active and inactive"
            icon={Tags}
            className="h-full"
          />
        </Link>
        <div className="col-span-1 md:col-span-2 xl:col-span-2">
          <CardStat
            title="Total Revenue"
            value={formatPrice(stats.sales)}
            description={`From ${stats.completedOrders} completed orders`}
            icon={DollarSign}
            className="h-full"
            iconClassName="bg-green-100"
          />
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-10">
        {/* Revenue Chart */}
        <RevenueChart data={revenueData} />
        
        {/* Top Products */}
        <TopProducts products={topProducts} />
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 gap-6">
        <RecentOrders orders={recentOrders} />
      </div>
    </Container>
  );
}