"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, scrollState } from "@/lib/scroll-state";
import { getLenis } from "@/lib/lenis-store";

/**
 * Fades/slides page content in on every route change and
 * keeps the global 3D scene theme in sync with the route.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // sync 3D theme with route
    if (pathname.startsWith("/about")) scrollState.theme = "about";
    else if (pathname.startsWith("/projects")) scrollState.theme = "projects";
    else if (pathname.startsWith("/contact")) scrollState.theme = "contact";
    else scrollState.theme = "home";

    // reset scroll + stale triggers.
    // refresh is deferred one frame so the previous page's pinned
    // ScrollTriggers finish reverting before re-measure (avoids
    // client-navigation errors on pages with pin-spacers).
    getLenis()?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());

    if (prefersReducedMotion()) {
      return () => cancelAnimationFrame(rafId);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        veilRef.current,
        { scaleY: 1 },
        {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.9,
          ease: "power4.inOut",
        }
      );
      gsap.fromTo(
        wrapRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.15,
          ease: "power3.out",
          // a leftover transform on this wrapper would turn it into the
          // containing block for position:fixed children, breaking every
          // ScrollTrigger pin (content flies off-screen). Clear it, then
          // re-measure pins.
          clearProps: "transform",
          onComplete: () => ScrollTrigger.refresh(),
        }
      );
    });
    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={veilRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] origin-top scale-y-0 bg-gradient-to-b from-navy via-midnight to-void"
      />
      <div ref={wrapRef} className="flex min-h-screen flex-col">
        {children}
      </div>
    </>
  );
}
