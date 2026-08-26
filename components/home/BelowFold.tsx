"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import Statement from "./Statement";
import Services from "./Services";
import TechStack from "./TechStack";
import Stats from "./Stats";
import Testimonials from "./Testimonials";
import HomeCta from "./HomeCta";

/**
 * All below-the-fold home sections in ONE lazy chunk so they mount together.
 * After they mount (later than the initial page load), every pin/scrub range
 * on the page is re-measured once — otherwise ScrollTrigger keeps positions
 * computed against the placeholder height and sections hide/overlap.
 */
export default function BelowFold() {
  useEffect(() => {
    // parent effects run after all children's — every trigger exists by now
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <Statement />
      <Services />
      <TechStack />
      <Stats />
      <Testimonials />
      <HomeCta />
    </>
  );
}
