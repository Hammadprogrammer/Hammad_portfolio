"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";

type Node = {
  id: string;
  label: string;
  x: number; // % of container
  y: number;
  group: "frontend" | "backend" | "database" | "deployment" | "design" | "core";
  desc: string;
};

const NODES: Node[] = [
  /* --- frontend --- */
  { id: "frontend", label: "Frontend", x: 18, y: 8, group: "core", desc: "Interfaces built for speed and feel." },
  { id: "html", label: "HTML5", x: 6, y: 20, group: "frontend", desc: "Semantic, accessible markup." },
  { id: "css", label: "CSS3", x: 16, y: 32, group: "frontend", desc: "Modern layouts, animations and responsive design." },
  { id: "js", label: "JavaScript", x: 30, y: 20, group: "frontend", desc: "Deep language fundamentals — the base of everything." },
  { id: "ts", label: "TypeScript", x: 43, y: 10, group: "frontend", desc: "Strict typing across the whole stack." },
  { id: "react", label: "React", x: 8, y: 46, group: "frontend", desc: "Component architecture, hooks, performance tuning." },
  { id: "next", label: "Next.js", x: 22, y: 46, group: "frontend", desc: "App Router, RSC, ISR — production Next.js." },
  { id: "tailwind", label: "Tailwind CSS", x: 36, y: 32, group: "frontend", desc: "Utility-first styling, design systems at speed." },
  { id: "shadcn", label: "shadcn/ui", x: 12, y: 58, group: "frontend", desc: "Composable, accessible UI primitives." },
  { id: "mui", label: "MUI", x: 28, y: 60, group: "frontend", desc: "Material UI component systems and theming." },
  /* --- backend --- */
  { id: "backend", label: "Backend", x: 64, y: 8, group: "core", desc: "Systems that stay up and scale out." },
  { id: "csharp", label: "C#", x: 54, y: 20, group: "backend", desc: "Primary backend language — typed, fast, battle-tested." },
  { id: "dotnet", label: ".NET", x: 66, y: 26, group: "backend", desc: "ASP.NET Core APIs, EF Core, clean architecture." },
  { id: "node", label: "Node.js", x: 78, y: 14, group: "backend", desc: "BFFs, realtime services and tooling." },
  { id: "express", label: "Express.js", x: 90, y: 24, group: "backend", desc: "Minimal, fast REST APIs and middleware." },
  { id: "python", label: "Python", x: 52, y: 34, group: "backend", desc: "Scripting, automation and API development." },
  { id: "fastapi", label: "FastAPI", x: 64, y: 42, group: "backend", desc: "High-performance async Python APIs." },
  { id: "apis", label: "REST APIs", x: 78, y: 38, group: "backend", desc: "REST design, auth, rate limiting, versioning." },
  /* --- database --- */
  { id: "database", label: "Database", x: 46, y: 70, group: "core", desc: "Modeling data for correctness and speed." },
  { id: "sql", label: "SQL", x: 36, y: 82, group: "database", desc: "Queries, joins, indexes and optimization." },
  { id: "pg", label: "PostgreSQL", x: 48, y: 92, group: "database", desc: "Indexes, query plans, migrations." },
  { id: "mongo", label: "MongoDB", x: 60, y: 84, group: "database", desc: "Document modeling and aggregation pipelines." },
  { id: "firebase", label: "Firebase", x: 68, y: 66, group: "database", desc: "Realtime data, auth and cloud functions." },
  { id: "supabase", label: "Supabase", x: 33, y: 64, group: "database", desc: "Postgres-powered backend as a service." },
  /* --- deployment --- */
  { id: "deployment", label: "Deployment", x: 86, y: 52, group: "core", desc: "From commit to production, smoothly." },
  { id: "vercel", label: "Vercel", x: 92, y: 66, group: "deployment", desc: "Edge deploys, previews and analytics." },
  { id: "railway", label: "Railway", x: 82, y: 78, group: "deployment", desc: "Backend and database hosting made simple." },
  { id: "git", label: "Git", x: 94, y: 40, group: "deployment", desc: "Branching strategies and clean history." },
  { id: "github", label: "GitHub", x: 70, y: 92, group: "deployment", desc: "PRs, reviews, actions and collaboration." },
  /* --- design --- */
  { id: "design", label: "Design", x: 8, y: 76, group: "core", desc: "Where engineering meets aesthetics." },
  { id: "figma", label: "Figma", x: 16, y: 90, group: "design", desc: "UI design, prototyping and dev handoff." },
];

const LINKS: [string, string][] = [
  ["frontend", "html"],
  ["frontend", "css"],
  ["frontend", "js"],
  ["frontend", "ts"],
  ["frontend", "react"],
  ["frontend", "next"],
  ["frontend", "tailwind"],
  ["js", "ts"],
  ["react", "next"],
  ["react", "shadcn"],
  ["next", "mui"],
  ["css", "tailwind"],
  ["backend", "csharp"],
  ["backend", "dotnet"],
  ["backend", "node"],
  ["backend", "python"],
  ["backend", "apis"],
  ["csharp", "dotnet"],
  ["node", "express"],
  ["python", "fastapi"],
  ["dotnet", "apis"],
  ["express", "apis"],
  ["fastapi", "apis"],
  ["ts", "backend"],
  ["database", "sql"],
  ["database", "pg"],
  ["database", "mongo"],
  ["database", "firebase"],
  ["database", "supabase"],
  ["sql", "pg"],
  ["apis", "database"],
  ["deployment", "vercel"],
  ["deployment", "railway"],
  ["deployment", "git"],
  ["deployment", "github"],
  ["git", "github"],
  ["firebase", "deployment"],
  ["design", "figma"],
  ["design", "shadcn"],
  ["next", "database"],
];

const GROUP_COLOR: Record<Node["group"], string> = {
  core: "#f4f7fb",
  frontend: "#22e0ff",
  backend: "#8b7bff",
  database: "#2dd4bf",
  deployment: "#fbbf24",
  design: "#f0abfc",
};

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-node]",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.06,
          duration: 0.7,
          ease: "back.out(2)",
          scrollTrigger: { trigger: el, start: "top 65%" },
        }
      );
      gsap.fromTo(
        "[data-link]",
        { opacity: 0 },
        {
          opacity: 1,
          stagger: 0.04,
          duration: 0.6,
          delay: 0.3,
          scrollTrigger: { trigger: el, start: "top 65%" },
        }
      );
      // slow constellation drift
      gsap.to("[data-constellation]", {
        y: -20,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const connected = new Set<string>(
    hovered
      ? LINKS.filter(([a, b]) => a === hovered || b === hovered).flat()
      : []
  );

  const hoveredNode = NODES.find((n) => n.id === hovered);

  return (
    <section
      ref={ref}
      id="skills"
      className="relative z-10 mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-24"
      aria-label="Skills"
    >
      <div className="mb-12">
        <p className="mono-font text-[10px] uppercase tracking-[0.4em] text-silver">
          Capabilities
        </p>
        <h2 className="display-font mt-3 text-4xl font-semibold text-ice md:text-6xl">
          A connected <span className="text-gradient">skill map.</span>
        </h2>
      </div>

      {/* Desktop constellation */}
      <div
        data-constellation
        className="relative hidden aspect-[16/10] w-full md:block"
        role="img"
        aria-label="Skill constellation: frontend, backend and database technologies connected as a network"
      >
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          {LINKS.map(([a, b]) => {
            const na = NODES.find((n) => n.id === a)!;
            const nb = NODES.find((n) => n.id === b)!;
            const active = hovered === a || hovered === b;
            return (
              <line
                data-link
                key={`${a}-${b}`}
                x1={`${na.x}%`}
                y1={`${na.y}%`}
                x2={`${nb.x}%`}
                y2={`${nb.y}%`}
                stroke={active ? "#22e0ff" : "rgba(154,165,184,0.18)"}
                strokeWidth={active ? 1.5 : 1}
                style={{ transition: "stroke 0.3s" }}
              />
            );
          })}
        </svg>

        {NODES.map((n) => {
          const isCore = n.group === "core";
          const dim = hovered && hovered !== n.id && !connected.has(n.id);
          return (
            <button
              key={n.id}
              data-node
              type="button"
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(n.id)}
              onBlur={() => setHovered(null)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2 mono-font transition-all duration-300 ${
                isCore ? "text-xs font-medium" : "text-[11px]"
              } ${
                hovered === n.id
                  ? "scale-125 border-cyan-glow bg-cyan-glow/15 shadow-[0_0_30px_rgba(34,224,255,0.3)]"
                  : dim
                    ? "border-ice/15 opacity-45"
                    : "border-ice/20 bg-navy/60"
              }`}
              style={{ left: `${n.x}%`, top: `${n.y}%`, color: GROUP_COLOR[n.group] }}
            >
              {n.label}
            </button>
          );
        })}

        {/* hover description — appears right beside the hovered node */}
        <div
          aria-live="polite"
          className={`glass pointer-events-none absolute z-10 w-64 rounded-xl px-5 py-4 transition-opacity duration-300 ${
            hoveredNode ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: `${hoveredNode?.x ?? 50}%`,
            top: `${hoveredNode?.y ?? 50}%`,
            transform: `translate(${(hoveredNode?.x ?? 50) > 62 ? "calc(-100% - 24px)" : "24px"}, ${
              (hoveredNode?.y ?? 50) > 65 ? "calc(-100% - 12px)" : "12px"
            })`,
          }}
        >
          <p className="display-font text-sm font-semibold text-ice">
            {hoveredNode?.label}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-silver">
            {hoveredNode?.desc}
          </p>
        </div>
      </div>

      {/* Mobile categorized lists */}
      <div className="grid gap-8 md:hidden">
        {(["frontend", "backend", "database", "deployment", "design"] as const).map((group) => (
          <div key={group} className="glass rounded-2xl p-6">
            <h3
              className="mono-font text-[10px] uppercase tracking-[0.35em]"
              style={{ color: GROUP_COLOR[group] }}
            >
              {group}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {NODES.filter((n) => n.group === group).map((n) => (
                <li key={n.id} className="flex flex-col">
                  <span className="display-font text-base font-medium text-ice">
                    {n.label}
                  </span>
                  <span className="text-xs text-silver">{n.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
