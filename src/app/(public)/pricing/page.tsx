import PricingContent from "@/components/public/PricingContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function PricingPage() {
  return (
    <>
      <Suspense fallback={<Skeleton className="h-20 w-full" count={4} />}>
        <PricingContent />
      </Suspense>
    </>
  );
}
