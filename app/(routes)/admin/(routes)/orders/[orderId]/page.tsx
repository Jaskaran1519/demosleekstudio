import { notFound } from 'next/navigation';
import { getOrderById } from '@/actions/orders';
import { requireAdmin } from '@/lib/auth-utils';
import OopsMessage from '@/components/Others/OopsMessage';
import { Container } from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  PackageCheck, 
  User, 
  Calendar, 
  DollarSign,
  Tag 
} from 'lucide-react';
import Link from 'next/link';
import { OrderStatusBadge } from '../components/order-status-badge';
import { OrderStatusUpdate } from '../components/order-status-update';
import { formatPrice, formatDate } from '@/lib/utils';

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { isAuthorized, errorMessage } = await requireAdmin();
  
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
  
  // Resolve params
  const resolvedParams = await params;
  
  let order;
  try {
    order = await getOrderById(resolvedParams.orderId);
  } catch (error) {
    return notFound();
  }
  
  return (
    <Container className="py-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
    
      <div className="flex flex-col gap-y-4 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order ID: {order.id}</p>
        </div>
        
        <OrderStatusUpdate orderId={order.id} initialStatus={order.status} />
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Customer</h2>
          </div>
          <p>{order.user?.name || "Unknown"}</p>
          <p className="text-muted-foreground">{order.user?.email || "No email"}</p>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Order Date</h2>
          </div>
          <p>{formatDate(order.createdAt)}</p>
          <p className="text-muted-foreground">
            Status: <OrderStatusBadge status={order.status} />
          </p>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Payment</h2>
          </div>
          <p>Total: {formatPrice(order.total)}</p>
          <p className="text-muted-foreground">
            Status: {order.paymentStatus || "Unknown"}
          </p>
        </div>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Order Items */}
        <div className="md:col-span-8 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex border-b pb-4 last:pb-0 last:border-0">
                <div className="flex-shrink-0 mr-4">
                  {item.product?.images?.[0] ? (
                    <div className="h-20 w-20 relative rounded overflow-hidden">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="object-cover h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="h-20 w-20 bg-secondary flex items-center justify-center rounded">
                      <PackageCheck className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <h3 className="font-medium">
                        {item.product?.name || "Product"}
                      </h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.size && (
                          <span className="mr-3">Size: {item.size}</span>
                        )}
                        {item.color && (
                          <span>Color: {item.color}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <div>{formatPrice(item.price)} × {item.quantity}</div>
                      <div className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      
        {/* Order Summary */}
        <div className="md:col-span-4 rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {order.shipping > 0 
                  ? formatPrice(order.shipping) 
                  : 'Free'}
              </span>
            </div>
            {order.discountAmount && order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          
          {order.couponCode && (
            <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600" />
                <span className="text-green-700 text-sm font-medium">
                  Coupon applied: {order.couponCode}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
} 