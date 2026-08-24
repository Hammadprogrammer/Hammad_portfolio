"use client";

import { GraduationCap, Award } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export default function Education() {
  const scope = useReveal<HTMLElement>();

  return (
    <section
      ref={scope}
      id="education"
      className="relative z-10 mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-24"
      aria-label="Education and certifications"
    >
      <div className="mb-12">
        <p
          data-reveal="fade"
          className="mono-font text-[10px] uppercase tracking-[0.4em] text-silver"
        >
          Education
        </p>
        <h2
          data-reveal="blur"
          className="display-font mt-3 text-4xl font-semibold text-ice md:text-6xl"
        >
          Learning <span className="text-gradient">never stops.</span>
        </h2>
      </div>

      <div className="grid gap-16">
        {/* Degree — image/text split */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div
            data-reveal="left"
            className="glass relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,224,255,0.14),transparent_60%)]" />
            <GraduationCap className="h-20 w-20 text-cyan-glow/70" aria-hidden="true" />
          </div>
          <div data-reveal="right">
            <span className="mono-font text-[10px] uppercase tracking-[0.3em] text-cyan-glow">
              Degree
            </span>
            <h3 className="display-font mt-3 text-3xl font-semibold text-ice">
              Bachelor&apos;s Degree
            </h3>
            <p className="mono-font mt-2 text-xs text-violet-glow">
              Computer Science — University, Karachi
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-silver">
              Completed a comprehensive computer science program covering data
              structures, algorithms, databases and software engineering —
              the foundation everything else is built on.
            </p>
          </div>
        </div>

        {/* Certification — reversed split */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div data-reveal="left" className="md:order-1">
            <span className="mono-font text-[10px] uppercase tracking-[0.3em] text-violet-glow">
              Certification
            </span>
            <h3 className="display-font mt-3 text-3xl font-semibold text-ice">
              Full Stack Web Development
            </h3>
            <p className="mono-font mt-2 text-xs text-cyan-glow">
              Professional Certificate — 2023
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-silver">
              A certified full stack development course that went beyond
              syntax: how systems are designed, deployed and kept alive
              in production — from frontend to infrastructure.
            </p>
          </div>
          <div
            data-reveal="right"
            className="glass relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl md:order-2"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,123,255,0.14),transparent_60%)]" />
            <Award className="h-20 w-20 text-violet-glow/70" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
