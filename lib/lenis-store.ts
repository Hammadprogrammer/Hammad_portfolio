import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

export function scrollToTarget(target: string | number | HTMLElement) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
