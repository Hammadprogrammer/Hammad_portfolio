"use client";

import { useEffect, useRef } from "react";
import { Mail, MapPin, ArrowRight, Phone } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/scroll-state";
import { useReveal } from "@/hooks/useReveal";
import { useMagnetic } from "@/hooks/useMagnetic";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import ContactForm from "./ContactForm";

export default function ContactView() {
  const heroRef = useRef<HTMLElement>(null);
  const scope = useReveal<HTMLDivElement>();
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.3);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.3 })
        .fromTo(
          "[data-ch-line]",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, stagger: 0.13, ease: "power4.out" }
        )
        .fromTo(
          "[data-ch-sub]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        );

      gsap.to("[data-ch-wrap]", {
        y: -70,
        opacity: 0.45,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={scope}>
      {/* ---------- hero ---------- */}
      <section
        ref={heroRef}
        id="contact-hero"
        className="relative flex min-h-[80vh] items-center px-6 pt-24 md:px-10"
      >
        <div data-ch-wrap className="mx-auto w-full max-w-[1600px]">
          <p className="mono-font mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-violet-glow">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Available now
          </p>
          <h1 className="display-font font-semibold leading-[0.95]">
            <span className="block overflow-hidden">
              <span data-ch-line className="block text-[12vw] text-ice md:text-[8vw]">
                LET&apos;S MAKE
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-ch-line className="text-gradient block text-[12vw] md:text-[8vw]">
                SOMETHING REAL.
              </span>
            </span>
          </h1>
          <p data-ch-sub className="mt-10 max-w-md text-lg text-silver">
            Have a product, idea or technical challenge? Drop a message —
            I respond within 24 hours.
          </p>
        </div>
      </section>

      {/* ---------- form + info (editorial split) ---------- */}
      <section id="form" className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-20 lg:grid-cols-[1.6fr_1fr]">
          <div data-reveal="up">
            <ContactForm />
          </div>

          <aside className="flex flex-col gap-10">
            <div data-reveal="right" className="glass rounded-2xl p-7">
              <p className="mono-font flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Currently available
              </p>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                Open for freelance projects and full-time roles starting
                immediately. Typical response time:{" "}
                <strong className="text-ice">under 24 hours.</strong>
              </p>
            </div>

            <ul className="flex flex-col gap-6">
              <li data-reveal="right" data-reveal-delay="0.05" className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ice/15 text-cyan-glow">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="mono-font text-[10px] uppercase tracking-[0.3em] text-silver">Email</p>
                  <a
                    href="mailto:hammadzahid221@gmail.com"
                    className="link-underline text-sm text-ice"
                  >
                    hammadzahid221@gmail.com
                  </a>
                </div>
              </li>
              <li data-reveal="right" data-reveal-delay="0.1" className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ice/15 text-cyan-glow">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="mono-font text-[10px] uppercase tracking-[0.3em] text-silver">WhatsApp</p>
                  <a
                    href="https://wa.me/923118270539"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-ice"
                  >
                    +92 311 8270539
                  </a>
                </div>
              </li>
              <li data-reveal="right" data-reveal-delay="0.15" className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ice/15 text-cyan-glow">
                  <GithubIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="mono-font text-[10px] uppercase tracking-[0.3em] text-silver">GitHub</p>
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-ice"
                  >
                    github.com/muhammadhammad
                  </a>
                </div>
              </li>
              <li data-reveal="right" data-reveal-delay="0.2" className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ice/15 text-cyan-glow">
                  <LinkedinIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="mono-font text-[10px] uppercase tracking-[0.3em] text-silver">LinkedIn</p>
                  <a
                    href="https://linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-ice"
                  >
                    linkedin.com/in/muhammadhammad
                  </a>
                </div>
              </li>
              <li data-reveal="right" data-reveal-delay="0.25" className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ice/15 text-cyan-glow">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="mono-font text-[10px] uppercase tracking-[0.3em] text-silver">Location</p>
                  <p className="text-sm text-ice">Karachi, Pakistan — working worldwide</p>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* ---------- final CTA ---------- */}
      <section id="talk" className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-6 py-20 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.15),rgba(34,224,255,0.07)_55%,transparent_75%)] blur-xl"
        />
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2
            data-reveal="blur"
            className="display-font max-w-4xl text-[9vw] font-semibold leading-[1.05] text-ice md:text-[4.5vw]"
          >
            THE NEXT PROJECT <span className="text-gradient">COULD BE YOURS.</span>
          </h2>
          <a
            ref={ctaRef}
            data-reveal="scale"
            data-reveal-delay="0.15"
            href="mailto:hammadzahid221@gmail.com"
            data-cursor="OPEN"
            className="group mt-12 inline-flex items-center gap-4 rounded-full border border-violet-glow/50 bg-violet-glow/5 px-10 py-5 mono-font text-xs uppercase tracking-[0.3em] text-violet-glow transition-colors duration-500 hover:bg-violet-glow hover:text-void"
          >
            Let&apos;s talk
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
          </a>
        </div>
      </section>
    </div>
  );
}
