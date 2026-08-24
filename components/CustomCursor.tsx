"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { isTouchDevice, prefersReducedMotion } from "@/lib/scroll-state";

/**
 * Desktop-only custom cursor.
 * Elements opt into labels via [data-cursor="VIEW" | "OPEN" | "DRAG"].
 * Interactive elements (a, button) expand the ring.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const cursorEl = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a, button, [role='button'], input, textarea, select, label");

      if (cursorEl) {
        label.textContent = cursorEl.dataset.cursor || "";
        gsap.to(ring, { scale: 3.2, backgroundColor: "rgba(34,224,255,0.12)", duration: 0.35 });
        gsap.to(label, { opacity: 1, duration: 0.25 });
        gsap.to(dot, { scale: 0, duration: 0.25 });
      } else if (interactive) {
        gsap.to(ring, { scale: 1.9, backgroundColor: "rgba(34,224,255,0.06)", duration: 0.35 });
        gsap.to(label, { opacity: 0, duration: 0.2 });
        gsap.to(dot, { scale: 0.6, duration: 0.25 });
      } else {
        gsap.to(ring, { scale: 1, backgroundColor: "rgba(34,224,255,0)", duration: 0.35 });
        gsap.to(label, { opacity: 0, duration: 0.2 });
        gsap.to(dot, { scale: 1, duration: 0.25 });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block" aria-hidden="true">
      <div
        ref={ringRef}
        className="absolute -top-5 -left-5 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-glow/50"
      >
        <span
          ref={labelRef}
          className="mono-font text-[3px] font-medium tracking-widest text-ice opacity-0"
          style={{ fontSize: "3.5px" }}
        >
          VIEW
        </span>
      </div>
      <div
        ref={dotRef}
        className="absolute -top-[3px] -left-[3px] h-1.5 w-1.5 rounded-full bg-cyan-glow"
      />
    </div>
  );
}
