"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGsapLayoutEffect } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";
import { featuredProjects } from "@/lib/projects";
import SectionHeader from "@/components/SectionHeader";

export default function ProjectTunnel() {
  const pinRef = useRef<HTMLElement>(null);

  useGsapLayoutEffect(() => {
    const pin = pinRef.current;
    if (!pin || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", pin);
        const n = panels.length;

        // card deck: every new card rises from below and stacks ON TOP.
        // older cards stay visible behind — scaled down, lifted, dimmed.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: `+=${(n - 1) * 80}%`,
            pin: true,
            scrub: 1,
            snap: {
              snapTo: 1 / (n - 1),
              duration: { min: 0.3, max: 0.7 },
              delay: 0.05,
              ease: "power2.inOut",
            },
          },
        });

        panels.forEach((panel, i) => {
          if (i > 0) {
            // arrive from below — always something on screen while it travels
            tl.fromTo(
              panel,
              { yPercent: 115, rotation: i % 2 ? 4 : -4 },
              { yPercent: 0, rotation: 0, duration: 1, ease: "power2.out" },
              i - 1
            );
          }
          if (i < n - 1) {
            // recede into the background stack (still visible behind)
            tl.to(
              panel,
              {
                scale: 0.9 - (n - 2 - i) * 0.04,
                yPercent: -7 - (n - 2 - i) * 3,
                opacity: 0.75,
                filter: "brightness(0.85) blur(1px)",
                duration: 1,
                ease: "power2.inOut",
              },
              i
            );
          }
        });
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={pinRef}
      id="work"
      className="relative z-10 md:h-screen md:overflow-hidden"
      aria-label="Featured projects"
    >
      <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-16 md:px-10 md:py-0">
        <div className="md:pt-16">
          <SectionHeader
            index="06"
            label="Featured work"
            title={
              <>
                Projects, <span className="text-gradient">stacked.</span>
              </>
            }
          />
        </div>

        {/* card deck viewport — mobile: sticky stacking, desktop: GSAP deck */}
        <div className="relative mt-12 flex flex-1 flex-col gap-8 md:mt-0 md:block">
          {featuredProjects.map((p, i) => (
            <article
              key={p.slug}
              data-panel
              className="sticky top-24 md:static md:absolute md:inset-0 md:flex md:items-center"
              style={{ zIndex: i + 1 }}
            >
              <Link
                href={`/projects/${p.slug}`}
                data-cursor="VIEW"
                className="group block w-full md:mx-auto md:max-w-4xl"
              >
                <div
                  className={`glass relative overflow-hidden rounded-3xl bg-gradient-to-br ${p.hue} p-8 shadow-[0_-20px_60px_rgba(4,6,13,0.8)] transition-transform duration-700 md:p-14`}
                >
                  <div className="flex items-start justify-between">
                    <span className="mono-font text-xs text-cyan-glow">
                      PROJECT {p.index}
                    </span>
                    <span className="mono-font text-[10px] uppercase tracking-[0.3em] text-silver">
                      {p.category} · {p.year}
                    </span>
                  </div>

                  <h3 className="display-font mt-16 text-3xl font-semibold leading-tight text-ice md:mt-24 md:text-6xl">
                    {p.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-silver md:text-base">
                    {p.tagline}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <ul className="flex flex-wrap gap-2">
                      {p.tech.slice(0, 4).map((t) => (
                        <li
                          key={t}
                          className="mono-font rounded-full border border-ice/20 px-3 py-1 text-[10px] text-silver"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                    <span className="mono-font inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyan-glow">
                      View case
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </div>

                  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-glow/10 blur-3xl transition-opacity duration-700 group-hover:opacity-150" />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
