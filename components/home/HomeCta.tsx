"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";

export default function HomeCta() {
  const scope = useReveal<HTMLElement>();
  const btnRef = useMagnetic<HTMLAnchorElement>(0.3);

  return (
    <section
      ref={scope}
      id="cta"
      className="relative z-10 flex min-h-[60vh] items-center justify-center overflow-hidden px-6 py-20 md:py-24"
      aria-label="Call to action"
    >
      {/* decorative orb behind typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,123,255,0.16),rgba(34,224,255,0.08)_50%,transparent_70%)] blur-xl"
      />

      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        <p
          data-reveal="fade"
          className="mono-font flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-cyan-glow"
        >
          <span>08</span>
          <span className="inline-block h-px w-8 bg-cyan-glow/40" />
          Next step
        </p>
        <h2
          data-reveal="blur"
          className="display-font mt-6 text-[11vw] font-semibold leading-[1.02] text-ice md:text-[6vw]"
        >
          WHAT SHOULD WE <span className="text-gradient">BUILD NEXT?</span>
        </h2>
        <Link
          ref={btnRef}
          data-reveal="scale"
          data-reveal-delay="0.2"
          href="/contact"
          data-cursor="OPEN"
          className="group mt-14 inline-flex items-center gap-4 rounded-full border border-cyan-glow/50 bg-cyan-glow/5 px-10 py-5 mono-font text-xs uppercase tracking-[0.3em] text-cyan-glow transition-colors duration-500 hover:bg-cyan-glow hover:text-void"
        >
          Start a conversation
          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
        </Link>
      </div>
    </section>
  );
}
