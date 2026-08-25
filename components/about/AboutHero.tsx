"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";

export default function AboutHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const load = gsap.timeline({ delay: 0.3 });
      load
        .fromTo(
          "[data-ah-line]",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "power4.out" }
        )
        .fromTo(
          "[data-ah-sub]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        );

      // camera pull-back feel: heading scales down slightly, drifts up on scroll
      gsap.to("[data-ah-wrap]", {
        scale: 0.92,
        y: -80,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="about-hero" className="relative flex min-h-[92vh] items-center px-6 md:px-10">
      <div data-ah-wrap className="mx-auto w-full max-w-[1600px]">
        <p className="mono-font mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-violet-glow">
          <span className="inline-block h-px w-10 bg-violet-glow/60" />
          About
        </p>
        <h1 className="display-font font-semibold leading-[0.95]">
          <span className="block overflow-hidden">
            <span data-ah-line className="block text-[13vw] text-ice md:text-[80px]">
              BEHIND
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-ah-line className="text-gradient block text-[13vw] md:text-[80px]">
              THE CODE.
            </span>
          </span>
        </h1>
        <p data-ah-sub className="mt-8 max-w-3xl text-lg leading-relaxed text-silver md:text-2xl">
          Engineer. Builder. Problem solver. I&apos;m a full stack developer from
          Karachi who loves turning complex ideas into fast, reliable and
          engaging digital products — from scalable backend systems and seamless
          web applications to immersive 3D interfaces. Every project is a chance
          to learn something new and build something that lasts.
        </p>
      </div>
    </section>
  );
}
