"use client";

import { useRef } from "react";
import { Quote } from "lucide-react";
import { gsap, useGsapLayoutEffect } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";
import SectionHeader from "@/components/SectionHeader";

/* placeholder testimonials - replace with real client quotes later */
const TESTIMONIALS = [
  {
    quote:
      "Hammad delivered our platform ahead of schedule and it runs flawlessly. Communication was clear at every step.",
    name: "Ahmed R.",
    role: "Founder, E-Commerce Startup",
    tone: "border-cyan-glow/30",
  },
  {
    quote:
      "The dashboard he built handles our entire operation. Fast, stable and beautifully designed.",
    name: "Sarah K.",
    role: "Operations Lead, SaaS Company",
    tone: "border-violet-glow/30",
  },
  {
    quote:
      "Rare combination of backend depth and frontend polish. Our API response times dropped dramatically.",
    name: "Bilal M.",
    role: "CTO, Logistics Firm",
    tone: "border-cyan-glow/30",
  },
  {
    quote:
      "Professional, responsive and technically sharp. The 3D product showcase he built doubled our engagement.",
    name: "Fatima A.",
    role: "Marketing Director, Retail Brand",
    tone: "border-violet-glow/30",
  },
  {
    quote:
      "He understood the problem before writing a single line of code. The system has run without incident since launch.",
    name: "Usman T.",
    role: "Product Manager, Fintech",
    tone: "border-cyan-glow/30",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useGsapLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // heading reveal
      gsap.fromTo(
        "[data-tst-head]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          scrollTrigger: { trigger: el, start: "top 75%" },
        }
      );

      // opposing x-drift rows while scrolling vertically (y + x together)
      gsap.fromTo(
        "[data-tst-row='a']",
        { x: 80 },
        {
          x: -80,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
      gsap.fromTo(
        "[data-tst-row='b']",
        { x: -80 },
        {
          x: 80,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );

      // cards pop in
      gsap.fromTo(
        "[data-tst-card]",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          scrollTrigger: { trigger: el, start: "top 70%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const rowA = TESTIMONIALS.slice(0, 3);
  const rowB = TESTIMONIALS.slice(3);

  return (
    <section
      ref={ref}
      id="praise"
      className="relative z-10 overflow-hidden py-16 md:py-24"
      aria-label="Testimonials"
    >
      <div data-tst-head className="mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionHeader
          index="07"
          label="Testimonials"
          title={
            <>
              Trusted by <span className="text-gradient">people who ship.</span>
            </>
          }
        />
      </div>

      <div className="mt-12 flex flex-col gap-6">
        <div data-tst-row="a" className="flex gap-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:justify-center md:overflow-visible md:pb-0">
          {rowA.map((t) => (
            <TstCard key={t.name} t={t} />
          ))}
        </div>
        <div data-tst-row="b" className="flex gap-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:justify-center md:overflow-visible md:pb-0">
          {rowB.map((t) => (
            <TstCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TstCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure
      data-tst-card
      className={`glass w-[85vw] shrink-0 rounded-3xl border ${t.tone} p-7 md:w-[420px] md:shrink`}
    >
      <Quote className="h-5 w-5 text-cyan-glow/60" aria-hidden="true" />
      <blockquote className="mt-4 text-sm leading-relaxed text-ice/90">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6">
        <p className="display-font text-sm font-semibold text-ice">{t.name}</p>
        <p className="mono-font mt-1 text-[10px] uppercase tracking-[0.2em] text-silver">
          {t.role}
        </p>
      </figcaption>
    </figure>
  );
}
