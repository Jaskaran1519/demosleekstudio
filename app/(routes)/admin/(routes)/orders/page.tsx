import OopsMessage from '@/components/Others/OopsMessage';
import { requireAdmin } from '@/lib/auth-utils';
import { getAllOrders } from '@/actions/orders';
import { DataTable } from '@/components/ui/data-table';
import { OrdersTableColumns, OrderColumn } from './columns';
import { OrdersTableFilters } from './filters';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Suspense } from 'react';
import { OrdersTableSkeleton } from '@/components/dashboard/skeletons';

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
    status?: string;
  }>;
}

// Separate component for data fetching
async function OrdersContent({ searchParams }: OrdersPageProps) {
  // Resolve searchParams
  const resolvedParams = await searchParams;
  
  const page = Number(resolvedParams.page) || 1;
  const query = resolvedParams.query || '';
  const status = resolvedParams.status;

  const { orders: dbOrders, totalPages, currentPage } = await getAllOrders(
    page, 
    10, 
    query, 
    status
  );
  
  // Map DB orders to expected column format
  const orders = dbOrders.map(order => ({
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    total: order.total,
    user: order.user,
    items: order.items,
  })) as OrderColumn[];

  return (
    <>
      <div className="mb-8">
        <OrdersTableFilters />
      </div>
      
      <DataTable 
        columns={OrdersTableColumns} 
        data={orders} 
        filterValue={query}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  );
}

const OrdersPage = async({ searchParams }: OrdersPageProps) => {
  const { isAuthorized, user, errorMessage } = await requireAdmin();
  
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

  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">View and manage all customer orders</p>
      </div>
      
      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersContent searchParams={searchParams} />
      </Suspense>
    </Container>
  );
};

export default OrdersPage;