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

    const textEls = content.querySelectorAll<HTMLElement>("[data-hero-el]");

    if (prefersReducedMotion()) {
      gsap.set(textEls, { opacity: 1, x: 0, y: 0 });
      return;
    }

    let cancelWait = () => {};
    const ctx = gsap.context(() => {
      /* ---------- text in/out — slides in from the left, deterministic ---------- */
      let textShown = false;
      const showText = (show: boolean) => {
        if (textShown === show) return;
        textShown = show;
        gsap.to(textEls, {
          autoAlpha: show ? 1 : 0,
          x: show ? 0 : -70,
          duration: show ? 0.8 : 0.4,
          stagger: show ? 0.07 : 0.03,
          ease: show ? "power3.out" : "power2.in",
          overwrite: true,
        });
      };

      gsap.set(textEls, { autoAlpha: 0, x: -70 });

      /* entrance after preloader */
      cancelWait = whenPreloaderDone(() => showText(true));

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
              // text slides out past 18% and slides back in from the left
              // every time the user returns to the top of the hero
              showText(self.progress < 0.18);
            },
            onLeave: () => (scrollState.hero = 1),
            onLeaveBack: () => {
              scrollState.hero = 0;
              showText(true);
            },
          },
        });

        // phase 2: keywords take over the empty space (core travels across)
        tl.fromTo(
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
        // lighter mobile pin: text out, then keywords take the stage
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              scrollState.hero = self.progress;
              showText(self.progress < 0.4);
            },
            onLeaveBack: () => showText(true),
          },
        });
        tl.fromTo(
          "[data-hero-kw]",
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.25, immediateRender: false },
          0.5
        ).to("[data-hero-kw-label]", { opacity: 1, duration: 0.1 }, 0.52);
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
        className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-center px-6 pb-24 pt-24 md:px-10 md:pb-28 md:pt-28"
      >
        {/* left column — fills the empty space beside the 3D core */}
        <div className="md:max-w-[56%]">
          <p
            data-hero-el
            data-hero-label
            className="mono-font mt-0 md:mt-[100px] flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-cyan-glow opacity-0"
          >
            <span>01</span>
            <span className="inline-block h-px w-10 bg-cyan-glow/60 " />
            Full Stack Developer
          </p>

          <p
            data-hero-el
            data-hero-meta
            className="mono-font mt-5 text-xs uppercase tracking-[0.25em] text-silver opacity-0 md:text-sm"
          >
            Hi, I&apos;m{" "}
            <span className="font-semibold text-ice text-base md:text-[30px]">
              Muhammad Hammad
            </span>
          </p>

          <h1 data-hero-type className="display-font mt-4 font-semibold leading-[0.95] ">
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden ">
                <span
                  data-hero-el
                  data-hero-line
                  className={`block text-[11vw] sm:text-[52px] md:text-[80px] ${
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
            className="mt-6 max-w-md text-sm leading-relaxed text-silver opacity-0 md:text-base"
          >
         I design and engineer high-performance digital products — from scalable backend systems and seamless web applications to immersive 3D interfaces. I turn complex ideas into fast, reliable, and engaging digital experiences.

          </p>


        </div>

        {/* mid-scroll keywords layer — fills the pinned journey */}
        <div
          ref={keywordsRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
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
                className={`display-font block text-[9vw] font-semibold leading-[1.08] opacity-0 md:text-[6.5vw] ${k.style}`}
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
          className="group absolute bottom-[30px] left-1/2 flex -translate-x-1/2 items-center gap-3 mono-font text-[10px] uppercase tracking-[0.35em] text-silver opacity-0 transition-colors hover:text-cyan-glow"
        >
          Scroll to explore
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
