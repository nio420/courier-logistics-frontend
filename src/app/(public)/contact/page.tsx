import ContactContent from "@/components/public/ContactContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function ContactPage() {
  return (
    <>
      <Suspense fallback={<Skeleton className="h-20 w-full" count={4} />}>
        <ContactContent />
      </Suspense>
    </>
  );
}
