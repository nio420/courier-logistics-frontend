"use client";
import {
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  Headphones,
  Package,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    description: "For individuals and occasional deliveries.",
    price: "৳80",
    unit: "starting per parcel",
    icon: Package,
    featured: false,
    features: [
      "Standard parcel delivery",
      "Shipment tracking",
      "Delivery status updates",
      "Basic shipment history",
      "Online payment support",
    ],
  },
  {
    name: "Express",
    description: "For deliveries that need extra priority.",
    price: "৳150",
    unit: "starting per parcel",
    icon: Zap,
    featured: true,
    features: [
      "Express delivery option",
      "Shipment tracking",
      "Delivery status updates",
      "Priority handling option",
      "Online payment support",
      "Shipment history",
    ],
  },
  {
    name: "Business",
    description: "For teams managing regular shipments.",
    price: "Custom",
    unit: "based on your needs",
    icon: Truck,
    featured: false,
    features: [
      "Business shipment workflow",
      "Centralized shipment records",
      "Shipment tracking",
      "Payment history",
      "Courier assignment workflow",
      "Contact-based assistance",
    ],
  },
];

const comparison = [
  { feature: "Shipment booking", starter: true, express: true, business: true },
  {
    feature: "Shipment tracking",
    starter: true,
    express: true,
    business: true,
  },
  { feature: "Delivery updates", starter: true, express: true, business: true },
  { feature: "Express option", starter: false, express: true, business: true },
  { feature: "Shipment history", starter: true, express: true, business: true },
  {
    feature: "Business workflow",
    starter: false,
    express: false,
    business: true,
  },
];

const faqs = [
  {
    question: "Are these the final delivery prices?",
    answer:
      "No. These are illustrative prices for the frontend demo. Actual charges should be confirmed using your platform's real pricing rules, parcel weight, delivery zone, and service type.",
  },
  {
    question: "Can I track my shipment after booking?",
    answer:
      "The platform includes a shipment tracking experience. Tracking information depends on the shipment records and status updates available in the system.",
  },
  {
    question: "How can a business discuss pricing?",
    answer:
      "Business customers can contact the team to discuss their shipment volume and requirements. Business rates should be confirmed separately before being advertised as final.",
  },
  {
    question: "Can I change my delivery service?",
    answer:
      "Available service options depend on the shipment and your platform's supported workflow. Contact support if you need help choosing an option.",
  },
];

function FeatureMark({ included }: { included: boolean }) {
  return included ? (
    <Check aria-label="Included" className="mx-auto h-5 w-5 text-emerald-600" />
  ) : (
    <span aria-label="Not included" className="text-slate-300">
      —
    </span>
  );
}

export default function PricingContent() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative isolate bg-slate-950">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.28),transparent_50%)]" />

        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-violet-200">
            <ShieldCheck className="h-4 w-4" />
            Simple and transparent
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            The right delivery plan,
            <span className="block text-violet-400">
              without the guesswork.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Explore sample pricing options for everyday parcels, priority
            deliveries, and business shipping needs.
          </p>

          <Link
            href="#plans"
            className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/40"
          >
            Explore pricing
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="mt-5 text-xs leading-5 text-slate-400">
            Demo prices only. Final delivery charges may vary.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section
        id="plans"
        className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
            Choose your service
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pricing that fits your delivery needs
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            Start with the service that fits your shipment. Contact us if you
            need help understanding your options.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <article
                key={plan.name}
                className={`relative flex h-full flex-col rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
                  plan.featured
                    ? "border-violet-500 bg-white shadow-xl shadow-violet-100/70 ring-1 ring-violet-500"
                    : "border-slate-200 bg-white shadow-sm hover:border-violet-200 hover:shadow-slate-200/60"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white">
                    Priority option
                  </span>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {plan.name}
                    </h3>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                      {plan.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      plan.featured
                        ? "bg-violet-100 text-violet-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-7 border-b border-slate-100 pb-7">
                  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                      {plan.price}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{plan.unit}</p>
                </div>

                <ul className="mt-7 flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Business" ? "/contact" : "/register"}
                  className={`mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 ${
                    plan.featured
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 focus-visible:ring-violet-500/30"
                      : "border border-slate-200 bg-white text-slate-800 hover:border-violet-300 hover:bg-violet-50 focus-visible:ring-violet-500/20"
                  }`}
                >
                  {plan.name === "Business"
                    ? "Contact for pricing"
                    : "Get started"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-y border-slate-100 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
              Compare options
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              See what each plan includes
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Review the sample feature comparison before choosing a service.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th
                      scope="col"
                      className="px-5 py-5 font-semibold text-slate-900 sm:px-6"
                    >
                      Features
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-5 text-center font-semibold text-slate-900"
                    >
                      Starter
                    </th>
                    <th
                      scope="col"
                      className="bg-violet-50 px-4 py-5 text-center font-semibold text-violet-800"
                    >
                      Express
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-5 text-center font-semibold text-slate-900"
                    >
                      Business
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {comparison.map((item) => (
                    <tr
                      key={item.feature}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 font-medium text-slate-700 sm:px-6"
                      >
                        {item.feature}
                      </th>
                      <td className="px-4 py-4 text-center">
                        <FeatureMark included={item.starter} />
                      </td>
                      <td className="bg-violet-50/60 px-4 py-4 text-center">
                        <FeatureMark included={item.express} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <FeatureMark included={item.business} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            Illustrative comparison. Confirm actual features and charges with
            your platform configuration.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
              The value
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              More than just a delivery.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              A structured courier workflow can make shipment management easier
              to follow for both individuals and businesses.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
            >
              Explore our services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Clock3 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">
                Clear shipment updates
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Follow shipment progress through the available tracking
                timeline.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">
                Organized records
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep shipment and payment information easier to manage.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:col-span-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Headphones className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">
                Help when you need it
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Reach the support team with questions about shipment management,
                account access, or service options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <CircleHelp className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              A few helpful details about our sample pricing options.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-violet-200 sm:p-6"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-slate-900 marker:content-none">
                  <span>{faq.question}</span>
                  <span className="text-xl leading-5 text-violet-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 pr-2 text-sm leading-7 text-slate-500">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-violet-700 px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/15" />
          <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">
                Your next delivery
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to send your first parcel?
              </h2>
              <p className="mt-4 text-sm leading-7 text-violet-100 sm:text-base">
                Create an account to explore the shipment workflow and available
                delivery options.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
