import { describe, it, expect } from "vitest";
import { scrollState, isTouchDevice, prefersReducedMotion } from "../lib/scroll-state";

describe("scroll-state", () => {
  it("starts with sane defaults", () => {
    expect(scrollState.page).toBe(0);
    expect(scrollState.hero).toBe(0);
    expect(scrollState.theme).toBe("home");
  });

  it("isTouchDevice is false without a window (SSR safety)", () => {
    expect(isTouchDevice()).toBe(false);
  });

  it("prefersReducedMotion is false without a window (SSR safety)", () => {
    expect(prefersReducedMotion()).toBe(false);
  });
});
