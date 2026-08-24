"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Fallback from "./Fallback";
import { prefersReducedMotion } from "@/lib/scroll-state";

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

export default function SceneRoot() {
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");

  useEffect(() => {
    if (prefersReducedMotion() || !supportsWebGL()) {
      setMode("fallback");
    } else {
      setMode("webgl");
    }
  }, []);

  if (mode === "pending") return <Fallback />;
  if (mode === "fallback") return <Fallback />;
  return <Scene />;
}
