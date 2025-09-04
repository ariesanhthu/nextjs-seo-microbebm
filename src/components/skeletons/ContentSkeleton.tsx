import { Skeleton } from "../ui/skeleton";

export function ContentSkeleton() {
    return (
    <div className="container mx-auto px-4 py-8 mt-10">
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
    </div>
    )
}