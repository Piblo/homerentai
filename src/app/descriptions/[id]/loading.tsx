import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 w-full">
      <Skeleton className="w-[300px] h-8" />
      <Skeleton className="w-full max-w-[80ch] h-4" />
      <Skeleton className="w-full max-w-[80ch] h-4" />
      <Skeleton className="w-full max-w-[80ch] h-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
      </div>
    </div>
  );
}
