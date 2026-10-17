import ServicesContent from "@/components/public/ServicesContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function ServicesPage() {
  return (
    <>
      <Suspense fallback={<Skeleton className="h-20 w-full" count={4} />}>
        <ServicesContent />
      </Suspense>
    </>
  );
}
