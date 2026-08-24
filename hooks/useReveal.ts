"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";

/**
 * Scans the container for [data-reveal] descendants and wires
 * ScrollTrigger reveals based on the reveal type:
 *  up | down | left | right | scale | blur | clip | fade
 * Optional [data-reveal-delay] (seconds) and [data-reveal-stagger].
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const scope = useRef<T | null>(null);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
      targets.forEach((t) => {
        const type = t.dataset.reveal || "up";
        const delay = parseFloat(t.dataset.revealDelay || "0");
        const from: gsap.TweenVars = { opacity: 0 };
        const to: gsap.TweenVars = {
          opacity: 1,
          duration: 1.1,
          delay,
          ease: "power3.out",
          overwrite: "auto",
        };

        switch (type) {
          case "up":
            from.y = 80;
            to.y = 0;
            break;
          case "down":
            from.y = -80;
            to.y = 0;
            break;
          case "left":
            from.x = -150;
            to.x = 0;
            break;
          case "right":
            from.x = 150;
            to.x = 0;
            break;
          case "scale":
            from.scale = 0.8;
            to.scale = 1;
            break;
          case "blur":
            from.filter = "blur(15px)";
            to.filter = "blur(0px)";
            from.y = 40;
            to.y = 0;
            break;
          case "clip":
            from.clipPath = "inset(0 0 100% 0)";
            to.clipPath = "inset(0 0 0% 0)";
            break;
          case "fade":
          default:
            break;
        }

        gsap.fromTo(t, from, {
          ...to,
          scrollTrigger: {
            trigger: t,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return scope;
}

export { gsap, ScrollTrigger };
