import { CheckCircle2, Mail, PackageCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-2xl items-center px-4 py-12">
      <section className="w-full rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="size-9 text-green-600" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
          Thank you for your payment
        </h1>

        <p className="mt-3 text-muted-foreground">
          Stripe has redirected you back to the payment success page. Your
          payment confirmation is processed by our backend.
        </p>

        <div className="mt-6 rounded-xl bg-muted/50 p-4 text-left">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 size-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-semibold">Your invoice</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                After payment is confirmed, check your registered email for the
                invoice PDF. Check your spam folder too if it doesn't arrive.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/tracking">
              <PackageCheck className="mr-2 size-4" />
              Track shipment
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/shipments/create">Create another shipment</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
