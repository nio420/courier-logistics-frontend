"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, MapPin, Package, Truck } from "lucide-react";

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const handleNavigationClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const url = new URL(link.href, window.location.href);

      if (
        url.origin !== window.location.origin ||
        url.pathname === window.location.pathname
      ) {
        return;
      }

      setIsFading(false);
      setIsVisible(true);
    };

    document.addEventListener("click", handleNavigationClick);

    return () => {
      document.removeEventListener("click", handleNavigationClick);
    };
  }, []);

  useEffect(() => {
    if (previousPath.current === pathname) return;

    previousPath.current = pathname;

    // Also support navigation triggered programmatically.
    setIsFading(false);
    setIsVisible(true);

    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    hideTimer.current = setTimeout(() => {
      setIsFading(true);

      hideTimer.current = setTimeout(() => {
        setIsVisible(false);
        setIsFading(false);
        hideTimer.current = null;
      }, 450);
    }, 450);

    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className={`fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden bg-[#080D19]/95 backdrop-blur-xl transition-opacity duration-500 ${
        isFading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-7">
        {/* Route animation */}
        <div className="relative mx-auto mb-10 h-36 w-64 max-w-full">
          <div className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-slate-700" />

          <div className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 origin-left bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 animate-[routeLine_1.6s_ease-in-out_infinite]" />

          <div className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#101C2E] text-cyan-300 shadow-lg shadow-cyan-400/10">
            <MapPin className="h-5 w-5" />
          </div>

          <div className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-violet-300/20 bg-[#19152F] text-violet-300 shadow-lg shadow-violet-400/10">
            <Package className="h-5 w-5" />
          </div>

          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-blue-300/20 bg-[#12233B] text-blue-300 shadow-[0_0_35px_rgba(96,165,250,0.18)] animate-[deliveryMove_1.8s_ease-in-out_infinite]">
            <Truck className="h-6 w-6" />
          </div>

          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[10px] tracking-[0.25em] text-slate-500">
            <span>YOUR ROUTE</span>
            <ArrowRight className="h-3 w-3" />
            <span>YOUR DESTINATION</span>
          </div>
        </div>

        {/* Loading message */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            On the move
          </p>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Taking you there.
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            Preparing your next destination...
          </p>

          <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
            <span className="text-xs text-slate-400">Please wait a moment</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes routeLine {
          0% {
            transform: scaleX(0.08);
            opacity: 0.35;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
          100% {
            transform: scaleX(0.08);
            opacity: 0.35;
          }
        }

        @keyframes deliveryMove {
          0%,
          100% {
            left: 30%;
          }
          50% {
            left: 70%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
