"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { scrollToTarget } from "@/lib/lenis-store";

type Chapter = { id: string; label: string };

const CHAPTERS: Record<string, Chapter[]> = {
  "/": [
    { id: "hero", label: "Intro" },
    { id: "statement", label: "Vision" },
    { id: "services", label: "Craft" },
    { id: "stack", label: "Stack" },
    { id: "numbers", label: "Numbers" },
    { id: "work", label: "Work" },
    { id: "praise", label: "Praise" },
    { id: "cta", label: "Connect" },
  ],
  "/about": [
    { id: "about-hero", label: "Intro" },
    { id: "journey", label: "Journey" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
  ],
  "/contact": [
    { id: "contact-hero", label: "Intro" },
    { id: "form", label: "Message" },
    { id: "talk", label: "Connect" },
  ],
};

/**
 * Edolus-style vertical chapter dots (desktop). Tracks which
 * [data-chapter] section is in view; click jumps to it.
 */
export default function ChapterNav() {
  const pathname = usePathname();
  const [active, setActive] = useState(0);
  const chapters = CHAPTERS[pathname];

  // reset the active dot when the route changes (adjust state during render)
  const [trackedPath, setTrackedPath] = useState(pathname);
  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    setActive(0);
  }

  useEffect(() => {
    if (!chapters) return;

    let raf = 0;
    const measure = () => {
      const mid = window.innerHeight / 2;
      let idx = 0;
      chapters.forEach((c, i) => {
        const el = document.getElementById(c.id);
        if (!el) return;
        if (el.getBoundingClientRect().top <= mid) idx = i;
      });
      setActive(idx);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname, chapters]);

  if (!chapters) return null;

  return (
    <nav
      aria-label="Page chapters"
      className="fixed right-8 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex"
    >
      {chapters.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => {
            const el = document.getElementById(c.id);
            if (el) scrollToTarget(el);
          }}
          className="group flex items-center gap-3"
          aria-label={`Go to ${c.label}`}
          aria-current={active === i ? "true" : undefined}
        >
          <span
            className={`mono-font text-[9px] uppercase tracking-[0.3em] transition-all duration-300 ${
              active === i
                ? "text-cyan-glow opacity-100"
                : "translate-x-2 text-silver opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
            }`}
          >
            {c.label}
          </span>
          <span
            className={`block rounded-full transition-all duration-500 ${
              active === i
                ? "h-6 w-1.5 bg-cyan-glow shadow-[0_0_10px_rgba(34,224,255,0.7)]"
                : "h-1.5 w-1.5 bg-silver/60 group-hover:bg-silver"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
