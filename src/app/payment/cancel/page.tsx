import { CircleX, CreditCard } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-2xl items-center px-4 py-12">
      <section className="w-full rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-500/10">
          <CircleX className="size-9 text-amber-600" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
          Payment wasn't completed
        </h1>

        <p className="mt-3 text-muted-foreground">
          You left the Stripe Checkout page before completing payment. Your
          shipment may still be waiting for payment.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/shipments">
              <CreditCard className="mr-2 size-4" />
              View my shipments
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
