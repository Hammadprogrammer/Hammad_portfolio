"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { onFirstInteraction } from "@/lib/first-interaction";

/**
 * Interaction-only UI chrome (custom cursor, chapter dots, scroll progress).
 * None of it is visible or useful before the visitor moves the mouse or
 * scrolls, so its code stays out of the initial bundle.
 */
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const ChapterNav = dynamic(() => import("./ChapterNav"), { ssr: false });
const ScrollProgress = dynamic(() => import("./ScrollProgress"), { ssr: false });

export default function DeferredChrome() {
  const [ready, setReady] = useState(false);

  useEffect(() => onFirstInteraction(() => setReady(true)), []);

  if (!ready) return null;

  return (
    <>
      <CustomCursor />
      <ChapterNav />
      <ScrollProgress />
    </>
  );
}
