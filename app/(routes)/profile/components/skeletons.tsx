import { Skeleton } from "@/components/ui/skeleton";

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

// Addresses skeleton
export function AddressesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Orders skeleton
export function OrdersSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24 mt-2" />
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-16 mt-2" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((j) => (
                <div key={j} className="flex space-x-4">
                  <Skeleton className="w-16 h-16 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full max-w-[180px]" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Measurements skeleton
export function MeasurementsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <Skeleton key={j} className="h-4 w-24" />
              ))}
            </div>
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
} 