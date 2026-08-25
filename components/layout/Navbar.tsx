"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useMagnetic } from "@/hooks/useMagnetic";
import { getLenis } from "@/lib/lenis-store";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hireRef = useMagnetic<HTMLAnchorElement>(0.25);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menu on route change (adjust state during render — no extra pass)
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // animate mobile menu + lock scroll
  useEffect(() => {
    const lenis = getLenis();
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        menu,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.55, ease: "power4.out" }
      );
      gsap.fromTo(
        menu.querySelectorAll("[data-menu-link]"),
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.07, delay: 0.2, duration: 0.6 }
      );
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "backdrop-blur-xl bg-void/75 border-b border-ice/10" : ""
        }`}
      >
      <nav
        className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10"
        aria-label="Primary"
      >
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-cyan-glow/40">
            <span className="mono-font text-xs font-medium text-cyan-glow">MH</span>
            <span className="absolute inset-0 -z-10 bg-cyan-glow/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="display-font text-sm font-medium tracking-wide text-ice">
              Muhammad Hammad
            </span>
            <span className="mono-font text-[10px] uppercase tracking-[0.25em] text-silver">
              Full Stack Developer
            </span>
          </span>
        </Link>

        {/* desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`link-underline mono-font text-xs uppercase tracking-[0.2em] transition-colors ${
                  pathname === l.href ? "text-cyan-glow" : "text-silver hover:text-ice"
                }`}
                aria-current={pathname === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            ref={hireRef}
            href="/contact"
            className="group hidden items-center gap-2 rounded-full border border-cyan-glow/40 px-5 py-2 mono-font text-xs uppercase tracking-[0.2em] text-cyan-glow transition-colors hover:bg-cyan-glow/10 md:inline-flex"
          >
            Hire me
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ice/15 text-ice md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        </nav>
      </header>

      {/* overlay — sibling of <header> so its z-index isn't trapped by it */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[95] bg-void/80 backdrop-blur-sm md:hidden ${
          open ? "block" : "hidden"
        }`}
      />

      {/* mobile menu — right side drawer, 90% width */}
      <div
        ref={menuRef}
        style={{ backgroundColor: "var(--midnight)" }}
        className={`fixed inset-y-0 right-0 z-[100] w-[90%] flex-col justify-between border-l border-ice/10 px-6 pb-10 pt-20 md:hidden ${
          open ? "flex" : "hidden"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-ice/20 text-ice transition-colors hover:border-cyan-glow hover:text-cyan-glow"
        >
          <X className="h-5 w-5" />
        </button>

        <ul className="flex flex-col gap-2">
          {LINKS.map((l, i) => (
            <li key={l.href} data-menu-link>
              <Link
                href={l.href}
                className={`display-font flex items-baseline gap-4 py-3 text-4xl font-medium ${
                  pathname === l.href ? "text-cyan-glow" : "text-ice"
                }`}
              >
                <span className="mono-font text-xs text-silver">0{i + 1}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div data-menu-link className="flex flex-col gap-4">
          <a
            href="mailto:hammadzahid221@gmail.com"
            className="mono-font text-sm text-silver"
          >
            hammadzahid221@gmail.com
          </a>
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-glow px-6 py-4 mono-font text-xs font-medium uppercase tracking-[0.2em] text-void"
          >
            Start a conversation <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
