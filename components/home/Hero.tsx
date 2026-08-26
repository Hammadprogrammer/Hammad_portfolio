"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, ScrollTrigger, useGsapLayoutEffect } from "@/lib/gsap";
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

      // LCP: the heading is opaque in the server HTML (hidden behind the
      // preloader overlay), so only the transform is pre-set here. The
      // entrance below slides it in with the exact same timing/ease/stagger.
      gsap.set(textEls, { x: -70 });

      /* entrance after preloader */
      cancelWait = whenPreloaderDone(() => showText(true));

      /* ---------- keywords in/out — deterministic, like showText ----------
         Driven from scroll progress instead of scrubbed fromTo tweens, so a
         mid-scroll ScrollTrigger.refresh() (fonts loading, deferred sections
         mounting) can never leave them stuck hidden. */
      const KW = "[data-hero-kw]";
      const KW_LABEL = "[data-hero-kw-label]";
      gsap.set(KW, { yPercent: 100, opacity: 0, filter: "blur(8px)" });
      let kwState: "before" | "in" | "after" = "before";
      const showKeywords = (state: "before" | "in" | "after") => {
        if (kwState === state) return;
        kwState = state;
        if (state === "in") {
          gsap.to(KW, {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.07,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true,
          });
          gsap.to(KW_LABEL, { opacity: 1, duration: 0.3, overwrite: true });
        } else {
          gsap.to(KW, {
            yPercent: state === "before" ? 100 : -80,
            opacity: 0,
            filter: "blur(8px)",
            stagger: 0.05,
            duration: 0.35,
            ease: "power2.in",
            overwrite: true,
          });
          gsap.to(KW_LABEL, { opacity: 0, duration: 0.25, overwrite: true });
        }
      };

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
              const p = self.progress;
              scrollState.hero = p;
              // text slides out past 18% and slides back in from the left
              // every time the user returns to the top of the hero
              showText(p < 0.18);
              // phase 2/3: keywords enter after the text leaves, exit near the end
              showKeywords(p < 0.3 ? "before" : p <= 0.78 ? "in" : "after");
            },
            onLeave: () => {
              scrollState.hero = 1;
              showKeywords("after");
            },
            onLeaveBack: () => {
              scrollState.hero = 0;
              showText(true);
              showKeywords("before");
            },
          },
        });

        // gentle drift while the keywords hold, then hand-off scale
        tl.to(keywordsRef.current, { yPercent: -6, duration: 0.35, ease: "none" }, 0.5)
          .to(content, { scale: 0.96, duration: 0.2 }, 0.82);
      });

      mm.add("(max-width: 767px)", () => {
        // lighter mobile pin: text out, then keywords take the stage
        ScrollTrigger.create({
          trigger: pin,
          start: "top top",
          end: "+=120%",
          pin: true,
          onUpdate: (self) => {
            const p = self.progress;
            scrollState.hero = p;
            showText(p < 0.4);
            showKeywords(p >= 0.45 ? "in" : "before");
          },
          onLeaveBack: () => {
            showText(true);
            showKeywords("before");
          },
        });
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
            className="mono-font mt-0 md:mt-[100px] flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-cyan-glow"
          >
            <span>01</span>
            <span className="inline-block h-px w-10 bg-cyan-glow/60 " />
            Full Stack Developer
          </p>

          <p
            data-hero-el
            data-hero-meta
            className="mono-font mt-5 text-xs uppercase tracking-[0.25em] text-silver md:text-sm"
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
                  }`}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-el
            data-hero-meta
            className="mt-6 max-w-md text-sm leading-relaxed text-silver md:text-base"
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
          className="group absolute bottom-[30px] left-1/2 flex -translate-x-1/2 items-center gap-3 mono-font text-[10px] uppercase tracking-[0.35em] text-silver transition-colors hover:text-cyan-glow"
        >
          Scroll to explore
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
