"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState, prefersReducedMotion } from "@/lib/scroll-state";
import { setLenis } from "@/lib/lenis-store";
import { onFirstInteraction } from "@/lib/first-interaction";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      // No smooth scroll for reduced-motion users
      return;
    }

    // Lenis only matters once the visitor scrolls, so it initialises on the
    // first interaction — keeping its setup out of the initial-load work.
    let cleanup: (() => void) | undefined;
    const cancel = onFirstInteraction(() => {
      const lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });
      setLenis(lenis);

      lenis.on("scroll", (e: Lenis) => {
        ScrollTrigger.update();
        const max = e.limit || 1;
        scrollState.page = e.scroll / max;
        scrollState.velocity = e.velocity;
      });

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        setLenis(null);
      };
    });

    return () => {
      cancel();
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      scrollState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return <>{children}</>;
}
