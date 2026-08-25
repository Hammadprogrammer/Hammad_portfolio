"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";

export default function ProjectsHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.3 })
        .fromTo(
          "[data-ph-line]",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "power4.out" }
        )
        .fromTo(
          "[data-ph-sub]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        );

      gsap.to("[data-ph-wrap]", {
        y: -60,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative flex min-h-[70vh] items-end px-6 pb-24 pt-40 md:px-10">
      <div data-ph-wrap className="mx-auto w-full max-w-[1600px]">
        <p className="mono-font mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-cyan-glow">
          <span className="inline-block h-px w-10 bg-cyan-glow/60" />
          Portfolio
        </p>
        <h1 className="display-font font-semibold leading-[0.95]">
          <span className="block overflow-hidden">
            <span data-ph-line className="block text-[13vw] text-ice md:text-[80px]">
              SELECTED
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-ph-line className="text-gradient block text-[13vw] md:text-[80px]">
              WORK
            </span>
          </span>
        </h1>
        <p data-ph-sub className="mt-6 max-w-lg text-sm leading-relaxed text-silver md:text-base">
          Real products, live in production — from corporate platforms and
          service businesses to full stack systems and interactive experiences.
          Every project shipped end-to-end: design, code and deployment.
        </p>
      </div>
    </section>
  );
}
