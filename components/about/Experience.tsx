"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";

const EXPERIENCES = [
  {
    company: "Freelance / Contract",
    role: "Full Stack Developer",
    year: "2024 — Present",
    desc: "Building web applications end-to-end for clients: React/Next.js frontends with .NET and Node.js backends. Owning everything from database design to smooth production deploys.",
    tech: ["Next.js", "React", "ASP.NET Core", "PostgreSQL", "Docker"],
  },
  {
    company: "Independent Projects",
    role: "Freelance Developer",
    year: "2023 — 2024",
    desc: "Worked independently on web and mobile projects for small businesses — responsive UI design, performance optimization and delivering full products from concept to launch.",
    tech: ["React", "TypeScript", "Node.js", "SQL"],
  },
  {
    company: "Self-Directed",
    role: "Learning & Building",
    year: "2022 — 2023",
    desc: "Deep-dived into computer science fundamentals and shipped a portfolio of production-quality practice projects while mastering the modern JavaScript and C# ecosystems.",
    tech: ["JavaScript", "C#", "Git", "HTML/CSS"],
  },
];

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // glowing central line grows with scroll
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 1,
          },
        }
      );

      // nodes activate as line reaches them
      gsap.utils.toArray<HTMLElement>("[data-xp]", el).forEach((node, i) => {
        gsap.fromTo(
          node,
          { opacity: 0, x: i % 2 === 0 ? -80 : 80 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: { trigger: node, start: "top 78%" },
          }
        );
        const dot = node.querySelector("[data-xp-dot]");
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.5,
              ease: "back.out(2.5)",
              scrollTrigger: { trigger: node, start: "top 78%" },
            }
          );
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="experience"
      className="relative z-10 mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-24"
      aria-label="Professional experience"
    >
      <div className="mb-14 text-center">
        <p className="mono-font text-[10px] uppercase tracking-[0.4em] text-silver">
          Experience
        </p>
        <h2 className="display-font mt-3 text-4xl font-semibold text-ice md:text-6xl">
          My professional <span className="text-gradient">journey.</span>
        </h2>
      </div>

      <div className="relative">
        {/* glowing central line */}
        <div className="absolute left-4 top-0 h-full w-px bg-ice/10 md:left-1/2">
          <div
            ref={lineRef}
            className="h-full w-px scale-y-0 bg-gradient-to-b from-cyan-glow via-violet-glow to-cyan-glow shadow-[0_0_12px_rgba(34,224,255,0.6)]"
          />
        </div>

        <ol className="flex flex-col gap-20">
          {EXPERIENCES.map((xp, i) => (
            <li
              key={xp.year}
              data-xp
              className={`relative pl-12 md:w-1/2 md:pl-0 ${
                i % 2 === 0 ? "md:self-start md:pr-16" : "md:self-end md:pl-16"
              }`}
            >
              <span
                data-xp-dot
                className={`absolute top-8 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-glow shadow-[0_0_14px_rgba(34,224,255,0.9)] left-[17px] ${
                  i % 2 === 0
                    ? "md:left-auto md:right-0 md:translate-x-1/2"
                    : "md:left-0 md:-translate-x-1/2"
                }`}
              />
              <div className="glass rounded-2xl p-6 md:p-8">
                <span className="mono-font text-[10px] uppercase tracking-[0.3em] text-cyan-glow">
                  {xp.year}
                </span>
                <h3 className="display-font mt-2 text-2xl font-semibold text-ice">
                  {xp.role}
                </h3>
                <p className="mono-font mt-1 text-xs text-violet-glow">{xp.company}</p>
                <p className="mt-4 text-sm leading-relaxed text-silver">{xp.desc}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {xp.tech.map((t) => (
                    <li
                      key={t}
                      className="mono-font rounded-full border border-ice/20 px-3 py-1 text-[10px] text-silver"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
