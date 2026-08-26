"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import Story from "./Story";
import Experience from "./Experience";
import Skills from "./Skills";
import Education from "./Education";

/** Below-the-fold about sections in one lazy chunk (see home/BelowFold). */
export default function AboutBelowFold() {
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <Story />
      <Experience />
      <Skills />
      <Education />
    </>
  );
}
