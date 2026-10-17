import AboutSection from "@/components/home/AboutSection";
import FinalCTASection from "@/components/home/final-cta-section";
import HeroSection from "@/components/home/hero";
import HowItWorksSection from "@/components/home/how-it-works-section";
import ServicesSection from "@/components/home/services-section";
import TrackingCTA from "@/components/home/tracking-cta";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      <Suspense fallback={<Skeleton className="h-20 w-full" count={4} />}>
        {/* Hero */}
        <HeroSection />

        {/* Tracking callout */}
        <TrackingCTA />

        {/* Services */}
        <ServicesSection />

        {/* Why choose the platform */}
        <AboutSection />

        {/* How it works */}
        <HowItWorksSection />

        {/* Final CTA */}
        <FinalCTASection />
      </Suspense>
    </main>
  );
}
