"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Observer, Flip);
  gsap.defaults({ ease: "power3.out", duration: 1 });
}

/**
 * GSAP effects that PIN elements must use a layout effect: its cleanup
 * runs synchronously BEFORE React detaches DOM nodes, so pin-spacers
 * are reverted in time (prevents removeChild NotFoundError on route change).
 */
export const useGsapLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export { gsap, ScrollTrigger, Observer, Flip };
