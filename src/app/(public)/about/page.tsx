import AboutContent from "@/components/public/AboutContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function AboutPage() {
  return (
    <>
      <Suspense fallback={<Skeleton className="h-20 w-full" count={4} />}>
        <AboutContent />
      </Suspense>
    </>
  );
}
