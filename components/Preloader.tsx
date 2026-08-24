"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis-store";
import { prefersReducedMotion } from "@/lib/scroll-state";
import { markPreloaderDone } from "@/lib/preloader-state";

/**
 * Edolus-style preloader: percentage counter + brand mark,
 * then a cinematic wipe reveal. Runs once per full page load.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      markPreloaderDone();
      setDone(true);
      return;
    }

    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          lenis?.start();
          document.body.style.overflow = "";
          setDone(true);
        },
      });

      tl.fromTo(
        "[data-pl-brand]",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
        // count 0 → 100 with realistic pacing
        .to(counter, {
          v: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current)
              countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            if (barRef.current)
              barRef.current.style.transform = `scaleX(${counter.v / 100})`;
          },
        })
        .to("[data-pl-content]", {
          opacity: 0,
          y: -30,
          duration: 0.5,
          ease: "power2.in",
        })
        .call(() => markPreloaderDone())
        // wipe reveal
        .to(rootRef.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1,
          ease: "power4.inOut",
        });
    }, rootRef);

    return () => {
      ctx.revert();
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-void"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-label="Loading"
      role="status"
    >
      <div data-pl-content className="flex flex-col items-center gap-10">
        <div data-pl-brand className="flex flex-col items-center gap-4 opacity-0">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-glow/40">
            <span className="mono-font text-lg font-medium text-cyan-glow">MH</span>
          </span>
          <span className="mono-font text-[10px] uppercase tracking-[0.5em] text-silver">
            Muhammad Hammad
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <span
            ref={countRef}
            className="display-font text-6xl font-semibold tabular-nums text-ice"
          >
            000
          </span>
          <div className="h-px w-48 overflow-hidden bg-ice/10">
            <div
              ref={barRef}
              className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-glow to-violet-glow"
            />
          </div>
          <span className="mono-font text-[9px] uppercase tracking-[0.4em] text-silver/80">
            Entering digital space
          </span>
        </div>
      </div>
    </div>
  );
}
