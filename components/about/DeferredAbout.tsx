"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { onFirstInteraction } from "@/lib/first-interaction";

const AboutBelowFold = dynamic(() => import("./AboutBelowFold"), { ssr: false });

/** Mounts the below-the-fold about sections on the first interaction. */
export default function DeferredAbout() {
  const [ready, setReady] = useState(false);

  useEffect(() => onFirstInteraction(() => setReady(true)), []);

  if (!ready) return <div aria-hidden="true" className="min-h-screen" />;

  return <AboutBelowFold />;
}
