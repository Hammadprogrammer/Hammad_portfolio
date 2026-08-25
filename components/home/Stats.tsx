"use client";

import { useRef } from "react";
import { gsap, useGsapLayoutEffect } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";
import SectionHeader from "@/components/SectionHeader";

const STATS = [
  { value: 40, suffix: "+", label: "Projects shipped", tone: "text-cyan-glow" },
  { value: 4, suffix: "+", label: "Years building", tone: "text-violet-glow" },
  { value: 30, suffix: "+", label: "Happy clients", tone: "text-ice" },
  { value: 100, suffix: "%", label: "On-time delivery", tone: "text-cyan-glow" },
];

export default function Stats() {
  const ref = useRef<HTMLElement>(null);

  useGsapLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // cards rise in
      gsap.fromTo(
        "[data-stat]",
        { opacity: 0, y: 60, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.9,
          scrollTrigger: { trigger: el, start: "top 75%" },
        }
      );

      // numbers count up
      gsap.utils.toArray<HTMLElement>("[data-stat-num]", el).forEach((num) => {
        const target = Number(num.dataset.value || 0);
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 75%" },
          onUpdate: () => {
            num.textContent = String(Math.round(counter.v));
          },
        });
      });

      // alternating per-card parallax: even cards drift up, odd drift down
      gsap.utils.toArray<HTMLElement>("[data-stat]", el).forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 ? 28 : -28,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="numbers"
      className="relative z-10 mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24"
      aria-label="Statistics"
    >
      <div className="mb-12">
        <SectionHeader
          index="05"
          label="By the numbers"
          title={
            <>
              Results that <span className="text-gradient">compound.</span>
            </>
          }
        />
      </div>
      <div data-stat-row className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
        {STATS.map((s) => (
          <div
            key={s.label}
            data-stat
            className="glass group relative overflow-hidden rounded-3xl p-7 text-center transition-shadow duration-500 hover:shadow-[0_0_50px_rgba(34,224,255,0.12)] md:p-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,224,255,0.08),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <p className={`display-font text-4xl font-semibold tabular-nums md:text-6xl ${s.tone}`}>
              <span data-stat-num data-value={s.value}>
                0
              </span>
              {s.suffix}
            </p>
            <p className="mono-font mt-3 text-[10px] uppercase tracking-[0.25em] text-silver">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
