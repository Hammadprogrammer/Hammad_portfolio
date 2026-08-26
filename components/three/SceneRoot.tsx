"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Fallback from "./Fallback";
import { prefersReducedMotion, isTouchDevice } from "@/lib/scroll-state";
import { onFirstInteraction } from "@/lib/first-interaction";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <Fallback />,
});

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Decides whether the ~870KB WebGL bundle is worth downloading at all.
 * Phones, touch devices, data-saver and low-core machines get the static
 * gradient fallback instead — nothing extra is fetched for them.
 */
function shouldRenderWebGL(): boolean {
  if (prefersReducedMotion() || !supportsWebGL()) return false;
  if (isTouchDevice() || window.innerWidth < 1024) return false;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /2g|3g/.test(nav.connection.effectiveType))
    return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    return false;

  return true;
}

export default function SceneRoot() {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    if (!shouldRenderWebGL()) return;

    // Load the ~870KB WebGL bundle only on the visitor's first interaction
    // (mouse move / scroll / key press). Real users interact within
    // milliseconds, while the bundle stays entirely out of the initial
    // load — it never competes with LCP or blocks the main thread.
    return onFirstInteraction(() => setWebgl(true));
  }, []);

  return webgl ? <Scene /> : <Fallback />;
}
