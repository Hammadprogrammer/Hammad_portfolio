"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { gsap, useGsapLayoutEffect } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";
import { preloaderState } from "@/lib/preloader-state";
import { GithubIcon } from "@/components/icons";
import { useReveal } from "@/hooks/useReveal";
import type { Project } from "@/lib/projects";

export default function ProjectDetail({ project }: { project: Project }) {
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryPinRef = useRef<HTMLElement>(null);
  const scope = useReveal<HTMLDivElement>();

  /* hero: visual zooms, text drifts away on scroll */
  useEffect(() => {
    const el = heroRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // entrance only plays on client-side navigations — on a full load the
      // preloader overlay covers it, and skipping keeps the title/visual
      // painted from the server HTML for LCP
      if (preloaderState.done) {
        gsap
          .timeline({ delay: 0.2 })
          .fromTo(
            "[data-pd-visual]",
            { scale: 0.92, opacity: 0, clipPath: "inset(12% 8% 12% 8% round 24px)" },
            {
              scale: 1,
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0% round 24px)",
              duration: 1.3,
              ease: "power4.out",
            }
          )
          .fromTo(
            "[data-pd-title]",
            { yPercent: 110 },
            { yPercent: 0, duration: 1, ease: "power4.out" },
            "-=0.8"
          )
          .fromTo(
            "[data-pd-meta]",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.7 },
            "-=0.5"
          );
      }

      gsap.to("[data-pd-visual]", {
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to("[data-pd-head]", {
        y: -100,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  /* horizontal gallery: scroll-driven on desktop, native swipe on mobile */
  useGsapLayoutEffect(() => {
    const pin = galleryPinRef.current;
    const track = galleryRef.current;
    if (!pin || !track || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const getDistance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }, pin);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={scope}>
      {/* ---------- hero ---------- */}
      <section ref={heroRef} className="relative px-6 pt-28 md:px-10 md:pt-32">
        <div className="mx-auto max-w-[1600px]">
          <Link
            href="/projects"
            className="mono-font inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-silver transition-colors hover:text-cyan-glow"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All projects
          </Link>

          <div data-pd-head className="mt-10">
            <div className="overflow-hidden">
              <h1
                data-pd-title
                className="display-font text-[11vw] font-semibold leading-[0.95] text-ice md:text-[7vw]"
              >
                {project.title}
              </h1>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
              <div data-pd-meta>
                <p className="mono-font text-[10px] uppercase tracking-[0.3em] text-silver">Category</p>
                <p className="mt-1 text-sm text-ice">{project.category}</p>
              </div>
              <div data-pd-meta>
                <p className="mono-font text-[10px] uppercase tracking-[0.3em] text-silver">Year</p>
                <p className="mt-1 text-sm text-ice">{project.year}</p>
              </div>
              <div data-pd-meta>
                <p className="mono-font text-[10px] uppercase tracking-[0.3em] text-silver">Stack</p>
                <p className="mt-1 text-sm text-ice">{project.tech.slice(0, 4).join(" · ")}</p>
              </div>
              <div data-pd-meta className="flex items-end gap-3">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono-font inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cyan-glow transition-colors hover:bg-cyan-glow/10"
                  >
                    Live demo <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono-font inline-flex items-center gap-2 rounded-full border border-ice/15 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-silver transition-colors hover:border-ice/40 hover:text-ice"
                  >
                    GitHub <GithubIcon className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* large visual */}
          <div className="mt-14 overflow-hidden rounded-3xl">
            <div
              data-pd-visual
              className={`glass relative flex aspect-[16/8] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${project.hue}`}
              role="img"
              aria-label={`${project.title} cover visual`}
            >
              {project.cover ? (
                <Image
                  src={project.cover}
                  alt={`${project.title} website screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, 90vw"
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <span className="display-font text-[18vw] font-bold text-ice/5 md:text-[10vw]">
                  {project.index}
                </span>
              )}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,224,255,0.12),transparent_55%)]" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- overview / problem / solution ---------- */}
      <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-10">
        <div className="grid gap-16 md:grid-cols-[1fr_1.5fr]">
          <h2 data-reveal="left" className="display-font text-3xl font-semibold text-ice md:text-5xl">
            Overview
          </h2>
          <div className="flex flex-col gap-12">
            <p data-reveal="up" className="text-lg leading-relaxed text-silver">
              {project.overview}
            </p>
            <div data-reveal="up" className="grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="mono-font text-[10px] uppercase tracking-[0.35em] text-cyan-glow">Problem</h3>
                <p className="mt-4 text-sm leading-relaxed text-silver">{project.problem}</p>
              </div>
              <div>
                <h3 className="mono-font text-[10px] uppercase tracking-[0.35em] text-violet-glow">Solution</h3>
                <p className="mt-4 text-sm leading-relaxed text-silver">{project.solution}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- architecture ---------- */}
      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-10">
        <h2 data-reveal="blur" className="display-font text-3xl font-semibold text-ice md:text-5xl">
          Architecture
        </h2>
        <ol className="mt-12 grid gap-4 md:grid-cols-2">
          {project.architecture.map((a, i) => (
            <li
              key={a}
              data-reveal={i % 2 === 0 ? "left" : "right"}
              className="glass flex items-start gap-4 rounded-2xl p-6"
            >
              <span className="mono-font text-xs text-cyan-glow">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-ice/90">{a}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- features + tech ---------- */}
      <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-10">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 data-reveal="up" className="display-font text-3xl font-semibold text-ice md:text-4xl">
              Features
            </h2>
            <ul className="mt-8 flex flex-col gap-4">
              {project.features.map((f) => (
                <li key={f} data-reveal="up" className="flex items-center gap-4 border-b border-ice/5 pb-4">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-glow" />
                  <span className="text-sm text-ice/90">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 data-reveal="up" className="display-font text-3xl font-semibold text-ice md:text-4xl">
              Technology
            </h2>
            <ul className="mt-8 flex flex-wrap gap-3">
              {project.tech.map((t) => (
                <li
                  key={t}
                  data-reveal="scale"
                  className="mono-font rounded-full border border-ice/15 px-5 py-2.5 text-xs text-ice/90"
                >
                  {t}
                </li>
              ))}
            </ul>
            <h2 data-reveal="up" className="display-font mt-14 text-3xl font-semibold text-ice md:text-4xl">
              Challenges
            </h2>
            <ul className="mt-8 flex flex-col gap-4">
              {project.challenges.map((c) => (
                <li key={c} data-reveal="up" className="text-sm leading-relaxed text-silver">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- gallery (horizontal) ---------- */}
      <section
        ref={galleryPinRef}
        className="relative z-10 overflow-hidden py-16 md:h-screen md:py-0"
        aria-label="Project gallery"
      >
        <div className="flex h-full flex-col justify-center">
          <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
            <h2 data-reveal="blur" className="display-font text-3xl font-semibold text-ice md:text-5xl">
              Gallery
            </h2>
          </div>
          <div
            ref={galleryRef}
            className="mt-10 flex flex-col gap-6 px-6 md:w-max md:flex-row md:overflow-visible md:px-[10vw] md:pb-0"
          >
            {project.gallery.map((g) => (
              <figure
                key={g.label}
                className={`glass relative flex aspect-[16/10] w-full shrink-0 items-end overflow-hidden rounded-3xl bg-gradient-to-br p-6 md:w-[46vw] ${g.gradient}`}
              >
                {g.image && (
                  <Image
                    src={g.image}
                    alt={`${project.title} — ${g.label}`}
                    fill
                    sizes="(max-width: 768px) 80vw, 46vw"
                    className="object-cover object-top"
                  />
                )}
                <figcaption className="relative mono-font rounded-full bg-void/60 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-ice backdrop-blur">
                  {g.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- results ---------- */}
      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10">
        <h2 data-reveal="blur" className="display-font text-3xl font-semibold text-ice md:text-5xl">
          Results
        </h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {project.results.map((r) => (
            <li key={r} data-reveal="scale" className="glass rounded-2xl p-8">
              <span className="block h-1 w-10 bg-gradient-to-r from-cyan-glow to-violet-glow" />
              <p className="mt-6 text-base leading-relaxed text-ice">{r}</p>
            </li>
          ))}
        </ul>

        <div data-reveal="up" className="mt-24 flex flex-col items-center text-center">
          <p className="mono-font text-[10px] uppercase tracking-[0.4em] text-silver">
            Next
          </p>
          <Link
            href="/contact"
            data-cursor="OPEN"
            className="group mt-6 inline-flex items-center gap-3 display-font text-3xl font-semibold text-ice transition-colors hover:text-cyan-glow md:text-5xl"
          >
            Build something like this
            <ArrowUpRight className="h-8 w-8 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
