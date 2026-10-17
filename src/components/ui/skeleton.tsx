type SkeletonProps = {
  className?: string;
  count?: number;
};

export function Skeleton({
  className = "h-4 w-full",
  count = 1,
}: SkeletonProps) {
  return (
    <div role="status" aria-label="Loading" className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`}
        />
      ))}
    </div>
  );
}
