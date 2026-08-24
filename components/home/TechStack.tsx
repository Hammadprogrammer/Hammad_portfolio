"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  SiDotnet,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiMui,
  SiFramer,
  SiStyledcomponents,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiVercel,
  SiNetlify,
  SiGithub,
  SiPostman,
  SiFigma,
} from "react-icons/si";
import { TbBrandCSharp, TbDatabase } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";
import { gsap, useGsapLayoutEffect } from "@/lib/gsap";
import { prefersReducedMotion, isTouchDevice } from "@/lib/scroll-state";
import SectionHeader from "@/components/SectionHeader";

type Design = "hero" | "outline" | "orb";

const TECHS: {
  name: string;
  tag: string;
  design: Design;
  icon: IconType;
  color: string; // brand color
  grad: string;
}[] = [
  { name: "C#", tag: "Language", design: "hero", icon: TbBrandCSharp, color: "#b47ef0", grad: "from-[#b47ef0]/25 to-transparent" },
  { name: ".NET", tag: "Backend", design: "outline", icon: SiDotnet, color: "#8a6fff", grad: "from-[#8a6fff]/15 to-transparent" },
  { name: "ASP.NET CORE", tag: "APIs", design: "orb", icon: SiDotnet, color: "#c084fc", grad: "from-[#c084fc]/20 to-transparent" },
  { name: "React", tag: "Frontend", design: "hero", icon: SiReact, color: "#61dafb", grad: "from-[#61dafb]/25 to-transparent" },
  { name: "Next.js", tag: "Framework", design: "outline", icon: SiNextdotjs, color: "#f6f9fd", grad: "from-ice/10 to-transparent" },
  { name: "TypeScript", tag: "Type safety", design: "orb", icon: SiTypescript, color: "#4c9ef5", grad: "from-[#4c9ef5]/20 to-transparent" },
  { name: "JavaScript", tag: "Language", design: "hero", icon: SiJavascript, color: "#f7df1e", grad: "from-[#f7df1e]/15 to-transparent" },
  { name: "HTML5", tag: "Markup", design: "outline", icon: SiHtml5, color: "#e8622c", grad: "from-[#e8622c]/15 to-transparent" },
  { name: "CSS3", tag: "Styling", design: "orb", icon: SiCss, color: "#3b9ae8", grad: "from-[#3b9ae8]/20 to-transparent" },
  { name: "Tailwind CSS", tag: "Utility CSS", design: "hero", icon: SiTailwindcss, color: "#38bdf8", grad: "from-[#38bdf8]/20 to-transparent" },
  { name: "Material-UI", tag: "Components", design: "outline", icon: SiMui, color: "#3399ff", grad: "from-[#3399ff]/15 to-transparent" },
  { name: "Framer Motion", tag: "Animation", design: "orb", icon: SiFramer, color: "#e879f9", grad: "from-[#e879f9]/20 to-transparent" },
  { name: "Styled Components", tag: "CSS-in-JS", design: "hero", icon: SiStyledcomponents, color: "#db7093", grad: "from-[#db7093]/20 to-transparent" },
  { name: "Node.js", tag: "Runtime", design: "outline", icon: SiNodedotjs, color: "#6cc24a", grad: "from-[#6cc24a]/15 to-transparent" },
  { name: "Express.js", tag: "Web server", design: "orb", icon: SiExpress, color: "#f6f9fd", grad: "from-ice/10 to-transparent" },
  { name: "SQL", tag: "Queries", design: "hero", icon: TbDatabase, color: "#2dd4bf", grad: "from-[#2dd4bf]/20 to-transparent" },
  { name: "PostgreSQL", tag: "Database", design: "outline", icon: SiPostgresql, color: "#6ea9d8", grad: "from-[#6ea9d8]/20 to-transparent" },
  { name: "MongoDB", tag: "NoSQL", design: "orb", icon: SiMongodb, color: "#5fbf4d", grad: "from-[#5fbf4d]/20 to-transparent" },
  { name: "Firebase", tag: "BaaS", design: "hero", icon: SiFirebase, color: "#ffca28", grad: "from-[#ffca28]/15 to-transparent" },
  { name: "Docker", tag: "Containers", design: "outline", icon: SiDocker, color: "#2496ed", grad: "from-[#2496ed]/15 to-transparent" },
  { name: "Git", tag: "Versioning", design: "orb", icon: SiGit, color: "#f05033", grad: "from-[#f05033]/15 to-transparent" },
  { name: "GitHub", tag: "Collaboration", design: "hero", icon: SiGithub, color: "#f6f9fd", grad: "from-ice/10 to-transparent" },
  { name: "Vercel", tag: "Deployment", design: "outline", icon: SiVercel, color: "#f6f9fd", grad: "from-ice/10 to-transparent" },
  { name: "Netlify", tag: "Hosting", design: "orb", icon: SiNetlify, color: "#00c7b7", grad: "from-[#00c7b7]/20 to-transparent" },
  { name: "VS Code", tag: "Editor", design: "hero", icon: VscVscode, color: "#2f9cf0", grad: "from-[#2f9cf0]/20 to-transparent" },
  { name: "Postman", tag: "API testing", design: "outline", icon: SiPostman, color: "#ff6c37", grad: "from-[#ff6c37]/15 to-transparent" },
  { name: "Figma", tag: "Design", design: "orb", icon: SiFigma, color: "#f24e1e", grad: "from-[#f24e1e]/20 to-transparent" },
];

/* vertical wave offsets — tiles ride up/down while the track moves in x */
const WAVE = [0, 40, -30, 20, -40, 30, 0, -25, 35, -15, 25, -35];

/* per-tile theme: brand-tinted glow + accent exposed as CSS vars */
function themeVars(color: string): CSSProperties {
  return { "--glow": `${color}40`, "--accent": color } as CSSProperties;
}

export default function TechStack() {
  const pinRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGsapLayoutEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // entrance reveal: tiles pop in one-by-one as the section scrolls into view
      gsap.fromTo(
        "[data-tech]",
        { autoAlpha: 0, yPercent: 28, scale: 0.85 },
        {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: pin, start: "top 78%" },
        }
      );

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
          },
        });

        // y-motion inside the x-scroll: each tile rides a wave as it crosses
        gsap.utils.toArray<HTMLElement>("[data-tech]", track).forEach((tile, i) => {
          gsap.fromTo(
            tile,
            { y: WAVE[i % WAVE.length], rotation: i % 2 ? 2.5 : -2.5 },
            {
              y: -WAVE[i % WAVE.length],
              rotation: 0,
              ease: "none",
              scrollTrigger: {
                trigger: tile,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  // magnetic tiles (desktop)
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isTouchDevice() || prefersReducedMotion()) return;

    const cleanups: (() => void)[] = [];
    track.querySelectorAll<HTMLElement>("[data-tech]").forEach((tile) => {
      const xTo = gsap.quickTo(tile, "x", { duration: 0.4, ease: "power2.out" });
      const yTo = gsap.quickTo(tile, "y", { duration: 0.4, ease: "power2.out" });
      const rTo = gsap.quickTo(tile, "rotationY", { duration: 0.5, ease: "power2.out" });

      const move = (e: MouseEvent) => {
        const r = tile.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        xTo(dx * 18);
        yTo(dy * 18);
        rTo(dx * 14);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
        rTo(0);
      };
      tile.addEventListener("mousemove", move);
      tile.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        tile.removeEventListener("mousemove", move);
        tile.removeEventListener("mouseleave", leave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      ref={pinRef}
      id="stack"
      className="relative z-10 overflow-hidden md:h-screen"
      aria-label="Technology stack"
    >
      <div className="flex h-full flex-col justify-center py-16 md:py-0">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
          <SectionHeader
            index="04"
            label="Technology universe"
            title={
              <>
                Tools across <span className="text-gradient">the stack.</span>
              </>
            }
          />
        </div>

        {/* desktop: pinned horizontal track / mobile: native swipe */}
        <div
          ref={trackRef}
          className="mt-14 flex items-center gap-6 overflow-x-auto px-6 pb-6 [scrollbar-width:none] md:mt-16 md:w-max md:overflow-visible md:px-[10vw] md:pb-0"
          style={{ perspective: "800px" }}
        >
          {TECHS.map((t, i) => {
            const Icon = t.icon;

            /* --- design A: big gradient poster tile --- */
            if (t.design === "hero")
              return (
                <div
                  key={t.name}
                  data-tech
                  style={themeVars(t.color)}
                  className={`glass group relative flex h-48 w-52 shrink-0 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-5 ${t.grad} transition-shadow duration-500 hover:shadow-[0_0_60px_var(--glow)] md:h-64 md:w-72`}
                >
                  <div className="flex items-start justify-between">
                    <Icon aria-hidden="true" className="h-8 w-8 md:h-10 md:w-10" style={{ color: t.color }} />
                    <span className="mono-font rounded-full border border-ice/20 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-silver">
                      {t.tag}
                    </span>
                  </div>
                  {/* giant watermark icon as the "image" */}
                  <Icon
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-8 -right-6 h-40 w-40 opacity-[0.14] transition-transform duration-700 group-hover:scale-110 md:h-56 md:w-56"
                    style={{ color: t.color }}
                  />
                  <span
                    className="display-font relative text-2xl font-semibold md:text-3xl"
                    style={{ color: t.color }}
                  >
                    {t.name}
                  </span>
                </div>
              );

            /* --- design B: outlined technical card --- */
            if (t.design === "outline")
              return (
                <div
                  key={t.name}
                  data-tech
                  style={themeVars(t.color)}
                  className="group relative flex h-40 w-48 shrink-0 flex-col justify-between rounded-2xl border border-ice/15 bg-transparent p-5 transition-all duration-500 hover:border-[var(--accent)] hover:shadow-[0_0_50px_var(--glow)] md:h-52 md:w-60"
                >
                  <div className="flex items-center justify-between">
                    <Icon aria-hidden="true" className="h-7 w-7 md:h-9 md:w-9" style={{ color: t.color }} />
                    <span className="mono-font text-[10px] text-silver/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <span className="mono-font block text-[9px] uppercase tracking-[0.3em] text-silver">
                      {t.tag}
                    </span>
                    <span
                      className="display-font mt-2 block text-xl font-semibold md:text-2xl"
                      style={{ color: t.color }}
                    >
                      {t.name}
                    </span>
                    <span
                      className="mt-3 block h-px w-8 transition-all duration-500 group-hover:w-full"
                      style={{ background: t.color }}
                    />
                  </div>
                </div>
              );

            /* --- design C: glass orb tile --- */
            return (
              <div
                key={t.name}
                data-tech
                style={themeVars(t.color)}
                className="glass group relative flex h-44 w-44 shrink-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-full p-6 text-center transition-shadow duration-500 hover:shadow-[0_0_60px_var(--glow)] md:h-56 md:w-56"
              >
                <div
                  className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b opacity-60 ${t.grad}`}
                />
                <Icon
                  aria-hidden="true"
                  className="relative h-9 w-9 transition-transform duration-500 group-hover:scale-110 md:h-12 md:w-12"
                  style={{ color: t.color }}
                />
                <span className="mono-font relative text-[9px] uppercase tracking-[0.3em] text-silver">
                  {t.tag}
                </span>
                <span
                  className="display-font relative text-lg font-semibold md:text-xl"
                  style={{ color: t.color }}
                >
                  {t.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
