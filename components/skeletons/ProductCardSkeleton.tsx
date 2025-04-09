import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-none">
      <CardContent className="p-0">
        <Skeleton className="aspect-[4/5] w-full" />
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
} 