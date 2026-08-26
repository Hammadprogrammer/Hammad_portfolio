"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { onFirstInteraction } from "@/lib/first-interaction";

/**
 * Everything below the pinned full-screen hero. These sections only become
 * visible after the visitor scrolls, so their code (GSAP choreography,
 * react-icons, …) is kept out of the initial bundle and mounted on the
 * first interaction instead — nothing is removed, it just loads the moment
 * the visitor shows scroll intent.
 */
const BelowFold = dynamic(() => import("./BelowFold"), { ssr: false });

export default function DeferredHome() {
  const [ready, setReady] = useState(false);

  useEffect(() => onFirstInteraction(() => setReady(true)), []);

  if (!ready) {
    // keeps the document scrollable before the sections mount;
    // any interaction replaces it with the real content instantly
    return <div aria-hidden="true" className="min-h-screen" />;
  }

  return <BelowFold />;
}
