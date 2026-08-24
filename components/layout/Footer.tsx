"use client";

import Link from "next/link";
import { ArrowUp, MessageCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { scrollToTarget } from "@/lib/lenis-store";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReveal } from "@/hooks/useReveal";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const topRef = useMagnetic<HTMLButtonElement>(0.3);
  const scope = useReveal<HTMLElement>();

  return (
    <footer
      ref={scope}
      className="relative z-10 border-t border-ice/5 bg-midnight/70 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_auto]">
          <div data-reveal="up" className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-glow/40">
                <span className="mono-font text-xs text-cyan-glow">MH</span>
              </span>
              <span className="display-font text-lg font-medium text-ice">
                Muhammad Hammad
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-silver">
              Full Stack Developer crafting fast, scalable web applications.
              Available for freelance &amp; full-time roles.
            </p>
            <a
              href="mailto:hammadzahid221@gmail.com"
              className="link-underline w-fit mono-font text-sm text-cyan-glow"
            >
              hammadzahid221@gmail.com
            </a>
          </div>

          <nav data-reveal="up" data-reveal-delay="0.1" aria-label="Footer">
            <h3 className="mono-font mb-5 text-[10px] uppercase tracking-[0.3em] text-silver">
              Navigate
            </h3>
            <ul className="flex flex-col gap-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline text-sm text-ice/90 hover:text-ice"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div data-reveal="up" data-reveal-delay="0.2">
            <h3 className="mono-font mb-5 text-[10px] uppercase tracking-[0.3em] text-silver">
              Connect
            </h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ice/15 text-silver transition-colors hover:border-cyan-glow/50 hover:text-cyan-glow"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ice/15 text-silver transition-colors hover:border-cyan-glow/50 hover:text-cyan-glow"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/923221870539"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ice/15 text-silver transition-colors hover:border-cyan-glow/50 hover:text-cyan-glow"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
            <p className="mono-font mt-6 text-xs text-silver">+92 322 1870539</p>
            <p className="mono-font mt-1 text-xs text-silver">Karachi, Pakistan</p>
          </div>

          <div data-reveal="scale" className="flex items-start justify-end">
            <button
              ref={topRef}
              type="button"
              onClick={() => scrollToTarget(0)}
              className="group flex h-14 w-14 items-center justify-center rounded-full border border-cyan-glow/40 text-cyan-glow transition-colors hover:bg-cyan-glow/10"
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
            </button>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-ice/10 pt-6 sm:flex-row sm:items-center">
          <p className="mono-font text-xs text-silver">
            © {new Date().getFullYear()} Muhammad Hammad — Full Stack Developer
          </p>
          <p className="mono-font text-[10px] uppercase tracking-[0.3em] text-silver/80">
            Built with Next.js · GSAP · Three.js
          </p>
        </div>
      </div>
    </footer>
  );
}
