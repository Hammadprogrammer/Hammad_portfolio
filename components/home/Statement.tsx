"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";

const LINES = [
  { text: "I BUILD PRODUCTS", vars: { y: 120, x: 0, scale: 1, blur: 0 } },
  { text: "WHERE ENGINEERING", vars: { y: 60, x: -120, scale: 0.9, blur: 8 } },
  { text: "MEETS", vars: { y: 90, x: 120, scale: 1.05, blur: 0 } },
  { text: "EXPERIENCE.", vars: { y: 140, x: 0, scale: 0.85, blur: 14 } },
];

export default function Statement() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-line]").forEach((line, i) => {
        const v = LINES[i].vars;
        gsap.fromTo(
          line,
          {
            opacity: 0,
            y: v.y,
            x: v.x,
            scale: v.scale,
            filter: `blur(${v.blur}px)`,
            clipPath: "inset(0 0 100% 0)",
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            filter: "blur(0px)",
            clipPath: "inset(0 0 -10% 0)",
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 95%",
              end: "top 45%",
              scrub: 0.6 + i * 0.25, // each line at a different speed
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="statement"
      className="relative z-10 mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28"
    >
      <p className="mono-font mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-silver">
        <span className="text-cyan-glow">02</span>
        <span className="inline-block h-px w-8 bg-ice/20" />
        Vision
      </p>
      <h2 className="display-font font-semibold leading-[1.02]">
        {LINES.map((l, i) => (
          <span
            key={l.text}
            data-line
            className={`block text-[10vw] md:text-[6.5vw] ${
              i === 3 ? "text-gradient" : i === 1 ? "text-ice" : "text-ice/90"
            } ${i === 2 ? "text-outline" : ""}`}
          >
            {l.text}
          </span>
        ))}
      </h2>
    </section>
  );
}
