import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <Container className="py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="col-span-1 xl:col-span-1 h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16 mt-2" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-10">
        {/* Revenue Chart Skeleton */}
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[250px] w-full mt-8" />
          </CardContent>
        </Card>
        
        {/* Top Products Skeleton */}
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-[180px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-[180px] mb-2" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Skeleton */}
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-[150px] mb-2" />
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-[200px] mb-2" />
                  <Skeleton className="h-3 w-[150px] mb-1" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
} 