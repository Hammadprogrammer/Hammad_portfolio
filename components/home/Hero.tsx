"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, useGsapLayoutEffect } from "@/lib/gsap";
import { scrollState, prefersReducedMotion } from "@/lib/scroll-state";
import { scrollToTarget } from "@/lib/lenis-store";
import { whenPreloaderDone } from "@/lib/preloader-state";

const LINES = ["BUILDING", "THE DIGITAL", "FUTURE."];

const KEYWORDS = [
  { text: "REACT · NEXT.JS", style: "text-ice" },
  { text: "C# · .NET · NODE", style: "text-gradient" },
  { text: "THREE.JS · GSAP", style: "text-outline" },
];

export default function Hero() {
  const pinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const keywordsRef = useRef<HTMLDivElement>(null);

  useGsapLayoutEffect(() => {
    const pin = pinRef.current;
    const content = contentRef.current;
    if (!pin || !content) return;

    if (prefersReducedMotion()) {
      gsap.set(content.querySelectorAll("[data-hero-el]"), { opacity: 1, y: 0 });
      return;
    }

    let cancelWait = () => {};
    const ctx = gsap.context(() => {
      /* ---------- load timeline (waits for preloader) ---------- */
      const load = gsap.timeline({ paused: true, delay: 0.15 });
      cancelWait = whenPreloaderDone(() => load.play());
      load
        .fromTo(
          "[data-hero-label]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 }
        )
        .fromTo(
          "[data-hero-line]",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: "power4.out" },
          "-=0.3"
        )
        .fromTo(
          "[data-hero-meta]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          "-=0.5"
        )
        .fromTo(
          "[data-hero-cta]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.2"
        );

      /* ---------- pinned scroll choreography ---------- */
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 1,
            snap: {
              snapTo: [0, 0.45, 1],
              duration: { min: 0.3, max: 0.8 },
              delay: 0.05,
              ease: "power2.inOut",
            },
            onUpdate: (self) => {
              scrollState.hero = self.progress;
            },
            onLeave: () => (scrollState.hero = 1),
            onLeaveBack: () => (scrollState.hero = 0),
          },
        });

        // phase 1 → 2: main typography lifts away
        tl.to(
          "[data-hero-line]",
          {
            yPercent: -70,
            opacity: 0,
            filter: "blur(10px)",
            stagger: 0.05,
            duration: 0.22,
          },
          0.15
        )
          .to(
            "[data-hero-label], [data-hero-meta], [data-hero-cta]",
            { opacity: 0, duration: 0.15 },
            0.17
          )
          // phase 2: keywords take over the empty space (core travels across)
          .fromTo(
            "[data-hero-kw]",
            { yPercent: 100, opacity: 0, filter: "blur(8px)" },
            {
              yPercent: 0,
              opacity: 1,
              filter: "blur(0px)",
              stagger: 0.07,
              duration: 0.2,
            },
            0.32
          )
          .to("[data-hero-kw-label]", { opacity: 1, duration: 0.15 }, 0.34)
          // gentle drift while holding
          .to(keywordsRef.current, { yPercent: -6, duration: 0.35, ease: "none" }, 0.5)
          // phase 3: keywords exit, section hands off
          .to(
            "[data-hero-kw]",
            {
              yPercent: -80,
              opacity: 0,
              filter: "blur(8px)",
              stagger: 0.05,
              duration: 0.2,
            },
            0.78
          )
          .to("[data-hero-kw-label]", { opacity: 0, duration: 0.12 }, 0.8)
          .to(content, { scale: 0.96, duration: 0.2 }, 0.82);
      });

      mm.add("(max-width: 767px)", () => {
        // lighter mobile pin: shorter distance, no scatter
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 1,
            onUpdate: (self) => (scrollState.hero = self.progress),
          },
        });
        tl.to(content, { opacity: 0, y: -60, duration: 0.4 }, 0.55);
      });
    }, pin);

    return () => {
      cancelWait();
      ctx.revert();
      scrollState.hero = 0;
    };
  }, []);

  return (
    <section ref={pinRef} className="relative h-screen overflow-hidden" id="hero">
      <div
        ref={contentRef}
        className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-center px-6 md:px-10"
      >
        {/* left column — fills the empty space beside the 3D core */}
        <div className="md:max-w-[56%]">
          <p
            data-hero-el
            data-hero-label
            className="mono-font mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-cyan-glow opacity-0"
          >
            <span>01</span>
            <span className="inline-block h-px w-10 bg-cyan-glow/60" />
            Full Stack Developer
          </p>

          <p
            data-hero-el
            data-hero-meta
            className="mono-font mb-4 text-sm uppercase tracking-[0.35em] text-silver opacity-0 md:text-base"
          >
            Hi, I&apos;m{" "}
            <span className="font-semibold text-ice">Muhammad Hammad</span>
          </p>

          <h1 data-hero-type className="display-font font-semibold leading-[0.95]">
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  data-hero-el
                  data-hero-line
                  className={`block text-[14vw] md:text-[6.8vw] ${
                    i === 1 ? "text-gradient" : "text-ice"
                  } opacity-0`}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-el
            data-hero-meta
            className="mt-8 max-w-md text-sm leading-relaxed text-silver opacity-0 md:text-base"
          >
            I design and engineer fast, scalable digital products — from
            resilient backend systems to interactive 3D interfaces.
          </p>

          {/* quick stats strip */}
          <div
            data-hero-el
            data-hero-meta
            className="mt-8 flex flex-wrap gap-x-10 gap-y-4 opacity-0"
          >
            {[
              { v: "40+", l: "Projects shipped" },
              { v: "4+", l: "Years building" },
              { v: "30+", l: "Happy clients" },
            ].map((s) => (
              <div key={s.l}>
                <p className="display-font text-2xl font-semibold text-ice md:text-3xl">
                  {s.v}
                </p>
                <p className="mono-font mt-1 text-[10px] uppercase tracking-[0.25em] text-silver">
                  {s.l}
                </p>
              </div>
            ))}
          </div>

          <div
            data-hero-el
            data-hero-meta
            className="mono-font mt-8 flex gap-8 text-[10px] uppercase tracking-[0.3em] text-silver opacity-0"
          >
            <span>Karachi · PK</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              Available now
            </span>
          </div>
        </div>

        {/* mid-scroll keywords layer — fills the pinned journey */}
        <div
          ref={keywordsRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center md:flex"
        >
          <p
            data-hero-kw-label
            className="mono-font mb-8 text-[10px] uppercase tracking-[0.5em] text-cyan-glow opacity-0"
          >
            Powered by
          </p>
          {KEYWORDS.map((k) => (
            <span key={k.text} className="block overflow-hidden">
              <span
                data-hero-kw
                className={`display-font block text-[6.5vw] font-semibold leading-[1.08] opacity-0 ${k.style}`}
              >
                {k.text}
              </span>
            </span>
          ))}
        </div>

        <button
          data-hero-el
          data-hero-cta
          type="button"
          onClick={() => scrollToTarget("#statement")}
          className="group absolute bottom-10 left-6 flex items-center gap-3 mono-font text-[10px] uppercase tracking-[0.35em] text-silver opacity-0 transition-colors hover:text-cyan-glow md:left-10"
        >
          Scroll to explore
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
