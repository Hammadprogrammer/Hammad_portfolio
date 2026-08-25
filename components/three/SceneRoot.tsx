"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Fallback from "./Fallback";
import { prefersReducedMotion, isTouchDevice } from "@/lib/scroll-state";

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

    // wait until the browser is idle so the 3D bundle never competes with LCP
    const idle =
      window.requestIdleCallback?.(() => setWebgl(true), { timeout: 2500 }) ??
      window.setTimeout(() => setWebgl(true), 1200);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
    };
  }, []);

  return webgl ? <Scene /> : <Fallback />;
}
