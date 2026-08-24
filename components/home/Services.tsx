"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGsapLayoutEffect } from "@/lib/gsap";
import { scrollState, prefersReducedMotion } from "@/lib/scroll-state";

const SERVICES = [
  {
    id: "01",
    title: "FRONTEND ENGINEERING",
    desc: "Interfaces that feel instant. React, Next.js and TypeScript with obsessive attention to performance and detail.",
    env: "ui",
  },
  {
    id: "02",
    title: "BACKEND SYSTEMS",
    desc: "Resilient APIs and services in .NET and Node.js — event-driven, observable and built to scale horizontally.",
    env: "data",
  },
  {
    id: "03",
    title: "INTERACTIVE WEB",
    desc: "Scroll choreography, micro-interactions and motion systems powered by GSAP that turn pages into experiences.",
    env: "wave",
  },
  {
    id: "04",
    title: "3D EXPERIENCES",
    desc: "WebGL worlds with Three.js and React Three Fiber — shaders, cameras and scenes that react to the user.",
    env: "geo",
  },
] as const;

export default function Services() {
  const pinRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGsapLayoutEffect(() => {
    const pin = pinRef.current;
    if (!pin || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=280%",
            pin: true,
            scrub: true,
            snap: {
              snapTo: (v: number) =>
                Math.min(
                  0.999,
                  (Math.floor(v * SERVICES.length) + 0.5) / SERVICES.length
                ),
              duration: { min: 0.3, max: 0.7 },
              delay: 0.05,
              ease: "power2.inOut",
            },
            onToggle: (self) => {
              scrollState.servicesActive = self.isActive ? 1 : 0;
            },
            onUpdate: (self) => {
              const idx = Math.min(
                SERVICES.length - 1,
                Math.floor(self.progress * SERVICES.length)
              );
              scrollState.service = idx;
              setActive((prev) => (prev === idx ? prev : idx));
            },
          },
        });
      });
    }, pin);

    return () => {
      ctx.revert();
      scrollState.servicesActive = 0;
    };
  }, []);

  // animate service change
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-service-title]",
        { yPercent: 60, opacity: 0, filter: "blur(6px)" },
        { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }
      );
      gsap.fromTo(
        "[data-service-desc]",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.1 }
      );
      gsap.fromTo(
        "[data-service-env] > *",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.05, ease: "power2.out" }
      );
    }, stage);
    return () => ctx.revert();
  }, [active]);

  const s = SERVICES[active];

  return (
    <section ref={pinRef} id="services" className="relative z-10 md:h-screen" aria-label="Services">
      {/* Desktop pinned composition */}
      <div className="hidden h-full items-center md:flex">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[auto_1fr] items-center gap-16 px-10">
          {/* index rail */}
          <ol className="flex flex-col gap-6">
            {SERVICES.map((sv, i) => (
              <li key={sv.id}>
                <span
                  className={`mono-font block text-sm transition-all duration-500 ${
                    i === active
                      ? "scale-125 text-cyan-glow"
                      : "text-silver/70"
                  }`}
                >
                  {sv.id}
                </span>
                <span
                  className={`mt-1 block h-8 w-px transition-colors duration-500 ${
                    i === active ? "bg-cyan-glow/60" : "bg-ice/10"
                  } ${i === SERVICES.length - 1 ? "hidden" : ""}`}
                />
              </li>
            ))}
          </ol>

          {/* stage */}
          <div ref={stageRef} className="relative">
            <ServiceEnv env={s.env} />
            <p className="mono-font mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-silver">
              <span className="text-cyan-glow">03</span>
              <span className="inline-block h-px w-8 bg-ice/20" />
              What I do — {s.id}/04
            </p>
            <div className="overflow-hidden">
              <h2
                data-service-title
                className="display-font text-[5vw] font-semibold leading-[1.02] text-ice"
              >
                {s.title}
              </h2>
            </div>
            <p data-service-desc className="mt-6 max-w-xl text-base leading-relaxed text-silver">
              {s.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile stacked version */}
      <div className="flex flex-col gap-12 px-6 py-16 md:hidden">
        <p className="mono-font flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-silver">
          <span className="text-cyan-glow">03</span>
          <span className="inline-block h-px w-8 bg-ice/20" />
          What I do
        </p>
        {SERVICES.map((sv) => (
          <MobileService key={sv.id} sv={sv} />
        ))}
      </div>
    </section>
  );
}

/* per-service decorative environment */
function ServiceEnv({ env }: { env: string }) {
  return (
    <div
      data-service-env
      aria-hidden="true"
      className="pointer-events-none absolute -top-24 right-0 h-64 w-64 opacity-70"
    >
      {env === "ui" &&
        [0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-lg border border-cyan-glow/30 bg-cyan-glow/5 backdrop-blur"
            style={{
              width: 90 - i * 20,
              height: 56 - i * 10,
              top: i * 48,
              right: i * 60,
              transform: `rotate(${i * 6 - 6}deg)`,
            }}
          />
        ))}
      {env === "data" &&
        [0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-glow/50 to-transparent"
            style={{ width: 180 - i * 12, top: i * 34 + 20, right: i * 14 }}
          />
        ))}
      {env === "wave" &&
        [0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-violet-glow/30"
            style={{
              width: 80 + i * 60,
              height: 80 + i * 60,
              top: 60 - i * 30,
              right: 40 - i * 20,
            }}
          />
        ))}
      {env === "geo" &&
        [0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute border border-violet-glow/40"
            style={{
              width: 60 + i * 24,
              height: 60 + i * 24,
              top: i * 40,
              right: i * 50,
              transform: `rotate(${45 + i * 15}deg)`,
            }}
          />
        ))}
    </div>
  );
}

function MobileService({ sv }: { sv: (typeof SERVICES)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="border-l border-cyan-glow/25 pl-5">
      <span className="mono-font text-xs text-cyan-glow">{sv.id}</span>
      <h3 className="display-font mt-2 text-2xl font-semibold text-ice">{sv.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-silver">{sv.desc}</p>
    </div>
  );
}
