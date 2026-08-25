"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export default function Education() {
  const scope = useReveal<HTMLElement>();
  const [certOpen, setCertOpen] = useState(false);

  // close lightbox on Escape
  useEffect(() => {
    if (!certOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCertOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [certOpen]);

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
        <div className="grid items-stretch gap-10 md:grid-cols-2">
          <div
            data-reveal="left"
            className="glass relative min-h-[280px] overflow-hidden rounded-3xl md:min-h-full"
          >
            <Image
              src="/edu/hamdard-university.webp"
              alt="Hamdard University campus, Karachi"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent" />
          </div>
          <div data-reveal="right" className="flex flex-col justify-center">
            <span className="mono-font text-[10px] uppercase tracking-[0.3em] text-cyan-glow">
              Degree
            </span>
            <h3 className="display-font mt-3 text-3xl font-semibold text-ice">
              Digital Systems Web Technology (DSWT)
            </h3>
            <p className="mono-font mt-2 text-xs text-violet-glow">
              Hamdard University, Karachi 
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-silver">
              Studying digital systems and web technology at Hamdard University —
              a program covering data structures, databases, software engineering
              and modern web development. The academic foundation that everything
              else is built on.
            </p>
          </div>
        </div>

        {/* Certification — reversed split */}
        <div className="grid items-stretch gap-10 md:grid-cols-2">
          <div data-reveal="left" className="flex flex-col justify-center md:order-1">
            <span className="mono-font text-[10px] uppercase tracking-[0.3em] text-violet-glow">
              Certification
            </span>
            <h3 className="display-font mt-3 text-3xl font-semibold text-ice">
              Web &amp; Mobile Application Development
            </h3>
            <p className="mono-font mt-2 text-xs text-cyan-glow">
              Saylani Mass IT Training (SMIT) — Batch 11 · Jan 2024 – Oct 2024
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-silver">
              Successfully completed the 10-month Web &amp; Mobile App
              Development program at Saylani Mass IT Training as a Batch 11
              student — a hands-on, production-focused track covering the full
              MERN stack, deployment and modern software principles.
            </p>
            <p className="mono-font mt-4 text-[10px] uppercase tracking-[0.25em] text-silver/80">
              Click the certificate to view it full size
            </p>
          </div>
          <button
            type="button"
            data-reveal="right"
            onClick={() => setCertOpen(true)}
            aria-label="View certificate full size"
            className="glass group relative min-h-[280px] cursor-zoom-in overflow-hidden rounded-3xl md:order-2 md:min-h-full"
          >
            <Image
              src="/edu/saylani-certificate-b11.webp"
              alt="Saylani Mass IT Training certificate"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-void/70 text-cyan-glow opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
              <ZoomIn className="h-5 w-5" />
            </span>
          </button>
        </div>
      </div>

      {/* Certificate lightbox */}
      {certOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Certificate full view"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-void/90 p-4 backdrop-blur-md md:p-10"
          onClick={() => setCertOpen(false)}
        >
          <button
            type="button"
            aria-label="Close certificate view"
            onClick={() => setCertOpen(false)}
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-ice/20 bg-navy/80 text-ice transition-colors hover:border-cyan-glow hover:text-cyan-glow"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative h-full max-h-[90vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/edu/saylani-certificate-b11.webp"
              alt="Saylani Mass IT Training certificate — full view"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
