"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;

    const startPosition = window.scrollY;
    const duration = 1000;

    if (startPosition === 0) return;

    const scrollStep = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-in-out motion
      const easedProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition * (1 - easedProgress));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(scrollStep);
      }
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [pathname]);

  return null;
}
