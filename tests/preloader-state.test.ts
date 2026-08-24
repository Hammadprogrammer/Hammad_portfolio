// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("preloader-state", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("defers the callback until markPreloaderDone fires", async () => {
    const { whenPreloaderDone, markPreloaderDone } = await import(
      "../lib/preloader-state"
    );
    const cb = vi.fn();
    whenPreloaderDone(cb);
    expect(cb).not.toHaveBeenCalled();
    markPreloaderDone();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("runs the callback immediately if already done", async () => {
    const { whenPreloaderDone, markPreloaderDone } = await import(
      "../lib/preloader-state"
    );
    markPreloaderDone();
    const cb = vi.fn();
    whenPreloaderDone(cb);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("cancel function prevents the deferred callback", async () => {
    const { whenPreloaderDone, markPreloaderDone } = await import(
      "../lib/preloader-state"
    );
    const cb = vi.fn();
    const cancel = whenPreloaderDone(cb);
    cancel();
    markPreloaderDone();
    expect(cb).not.toHaveBeenCalled();
  });

  it("only fires each listener once even if marked done twice", async () => {
    const { whenPreloaderDone, markPreloaderDone } = await import(
      "../lib/preloader-state"
    );
    const cb = vi.fn();
    whenPreloaderDone(cb);
    markPreloaderDone();
    markPreloaderDone();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
