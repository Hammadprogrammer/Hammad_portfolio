"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, isTouchDevice } from "@/lib/scroll-state";
import { projects, type Project } from "@/lib/projects";

const SIZE_CLASS: Record<Project["size"], string> = {
  large: "md:col-span-8 md:row-span-2 min-h-[420px] md:min-h-[560px]",
  small: "md:col-span-4 min-h-[320px]",
  wide: "md:col-span-12 min-h-[300px] md:min-h-[360px]",
  tall: "md:col-span-5 md:row-span-2 min-h-[420px] md:min-h-[560px]",
};

export default function ProjectGrid() {
  const ref = useRef<HTMLDivElement>(null);

  // scroll reveals
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-card]", el).forEach((card, i) => {
        // entrance: slide up + in from alternating sides
        gsap.fromTo(
          card,
          { opacity: 0, y: 90, x: i % 2 ? 50 : -50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 1,
            delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
        // continuous x+y parallax while scrolling past
        gsap.to(card, {
          y: i % 2 ? 36 : -36,
          x: i % 3 === 0 ? -14 : i % 3 === 1 ? 0 : 14,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // desktop 3D tilt following cursor
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice() || prefersReducedMotion()) return;

    const cleanups: (() => void)[] = [];
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      const inner = card.querySelector<HTMLElement>("[data-card-inner]");
      if (!inner) return;
      const rx = gsap.quickTo(inner, "rotationX", { duration: 0.6, ease: "power2.out" });
      const ry = gsap.quickTo(inner, "rotationY", { duration: 0.6, ease: "power2.out" });
      const glowX = gsap.quickTo(card.querySelector("[data-glow]"), "xPercent", {
        duration: 0.6,
        ease: "power2.out",
      });
      const glowY = gsap.quickTo(card.querySelector("[data-glow]"), "yPercent", {
        duration: 0.6,
        ease: "power2.out",
      });

      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        ry(dx * 7);
        rx(-dy * 7);
        glowX(dx * 60);
        glowY(dy * 60);
      };
      const leave = () => {
        rx(0);
        ry(0);
        glowX(0);
        glowY(0);
      };
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div
      ref={ref}
      className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-6 pb-32 md:grid-cols-12 md:px-10"
    >
      {projects.map((p) => (
        <div
          key={p.slug}
          data-card
          className={SIZE_CLASS[p.size]}
          style={{ perspective: "1000px" }}
        >
          <Link
            href={`/projects/${p.slug}`}
            data-cursor="VIEW"
            className="group block h-full"
            aria-label={`View project: ${p.title}`}
          >
            <article
              data-card-inner
              className={`glass relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${p.hue} p-8 transition-shadow duration-500 hover:shadow-[0_20px_80px_rgba(34,224,255,0.10)] md:p-10`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                data-glow
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="flex items-start justify-between">
                <span className="mono-font text-xs text-cyan-glow">{p.index}</span>
                <span className="mono-font rounded-full border border-ice/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-silver">
                  {p.category}
                </span>
              </div>

              <div className="mt-auto pt-16">
                <h3 className="display-font text-2xl font-semibold text-ice transition-transform duration-500 group-hover:-translate-y-1 md:text-4xl">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-silver">
                  {p.description}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <ul className="flex flex-wrap gap-2">
                    {p.tech.slice(0, 3).map((t) => (
                      <li
                        key={t}
                        className="mono-font rounded-full border border-ice/20 px-3 py-1 text-[10px] text-silver"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="mono-font inline-flex translate-y-2 items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-cyan-glow opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    View project
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </div>
      ))}
    </div>
  );
}
