/**
 * Shared mutable state bridging GSAP ScrollTriggers (writers)
 * and the R3F render loop (reader). Avoids React re-renders.
 */
export const scrollState = {
  /** overall page scroll progress 0..1 */
  page: 0,
  /** velocity of scroll, smoothed */
  velocity: 0,
  /** hero pin progress 0..1 (home page) */
  hero: 0,
  /** active service index (home) */
  service: 0,
  /** 1 while the services section is pinned (home) — moves the core to the right */
  servicesActive: 0,
  /** normalized mouse -1..1 */
  mouseX: 0,
  mouseY: 0,
  /** route theme: shifts scene palette / composition */
  theme: "home" as "home" | "about" | "projects" | "contact",
};

export function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
