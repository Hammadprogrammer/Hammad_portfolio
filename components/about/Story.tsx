"use client";

import { useRef } from "react";
import { gsap, useGsapLayoutEffect } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";

const STAGES = [
  {
    id: "01",
    label: "BEGINNING",
    story:
      "Started in 2020 with curiosity and HTML. The first 'Hello World' on a live page was enough — I was hooked on making things exist on the internet.",
    tech: ["HTML", "CSS", "JavaScript"],
    accent: "text-cyan-glow",
    bar: "bg-cyan-glow",
  },
  {
    id: "02",
    label: "LEARNING",
    story:
      "Went deep instead of wide: JavaScript fundamentals, data structures, how browsers actually work. Built dozens of small projects that taught more than any tutorial.",
    tech: ["JavaScript", "Git", "SQL"],
    accent: "text-violet-glow",
    bar: "bg-violet-glow",
  },
  {
    id: "03",
    label: "BUILDING",
    story:
      "Discovered React and the component mindset. Then the backend called — C# and .NET turned me from a page-maker into a systems builder.",
    tech: ["React", "C#", ".NET", "PostgreSQL"],
    accent: "text-cyan-glow",
    bar: "bg-cyan-glow",
  },
  {
    id: "04",
    label: "PROFESSIONAL",
    story:
      "Shipped production software for real users: e-commerce, dashboards, APIs. Learned that engineering is a team sport played with code reviews and deadlines.",
    tech: ["Next.js", "ASP.NET Core", "Docker"],
    accent: "text-violet-glow",
    bar: "bg-violet-glow",
  },
  {
    id: "05",
    label: "NOW & BEYOND",
    story:
      "Today I build complete products where solid engineering meets memorable experience — resilient full stack systems with interfaces that feel alive. The learning never stops: currently going deeper into WebGL, real-time 3D and distributed system design.",
    tech: ["Three.js", "GSAP", "TypeScript", "System Design"],
    accent: "text-cyan-glow",
    bar: "bg-gradient-to-r from-cyan-glow to-violet-glow",
  },
];

export default function Story() {
  const pinRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGsapLayoutEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const getDistance = () => track.scrollWidth - window.innerWidth;
        const scrollTween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (STAGES.length - 1),
              duration: { min: 0.3, max: 0.8 },
              delay: 0.05,
              ease: "power2.inOut",
            },
          },
        });

        // per-stage parallax on inner content
        gsap.utils.toArray<HTMLElement>("[data-stage-inner]", track).forEach((inner) => {
          gsap.fromTo(
            inner,
            { opacity: 0.3, y: 40 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: inner,
                containerAnimation: scrollTween,
                start: "left 80%",
                end: "left 40%",
                scrub: true,
              },
            }
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stage]", pin).forEach((stage) => {
          gsap.fromTo(
            stage,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              scrollTrigger: { trigger: stage, start: "top 85%" },
            }
          );
        });
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={pinRef}
      id="journey"
      className="relative z-10 overflow-hidden md:h-screen"
      aria-label="My journey"
    >
      <div className="px-6 pt-24 md:absolute md:left-10 md:top-16 md:z-20 md:px-0 md:pt-0">
        <p className="mono-font text-[10px] uppercase tracking-[0.4em] text-silver">
          The journey
        </p>
        <h2 className="display-font mt-3 text-3xl font-semibold text-ice md:text-5xl">
          From curiosity <span className="text-gradient">to craft.</span>
        </h2>
      </div>

      <div
        ref={trackRef}
        className="mt-12 flex flex-col gap-16 px-6 pb-24 md:mt-0 md:h-full md:w-max md:flex-row md:items-center md:gap-0 md:px-0 md:pb-0"
      >
        {STAGES.map((s, i) => (
          <div
            key={s.id}
            data-stage
            className="md:flex md:h-full md:w-screen md:items-center md:px-[8vw]"
          >
            <div data-stage-inner className="max-w-xl">
              <div className="flex items-baseline gap-6">
                <span className={`display-font text-7xl font-bold opacity-45 md:text-9xl ${s.accent}`}>
                  {s.id}
                </span>
                <div>
                  <span className="mono-font text-[10px] uppercase tracking-[0.35em] text-silver">
                    Stage {i + 1} / {STAGES.length}
                  </span>
                  <h3 className={`display-font mt-1 text-3xl font-semibold md:text-5xl ${s.accent}`}>
                    {s.label}
                  </h3>
                </div>
              </div>
              <span className={`mt-6 block h-px w-24 ${s.bar}`} />
              <p className="mt-6 text-base leading-relaxed text-silver md:text-lg">
                {s.story}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.tech.map((t) => (
                  <li
                    key={t}
                    className="mono-font rounded-full border border-ice/20 px-3 py-1 text-[10px] text-silver"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
