export const preloaderState = { done: false };

export const PRELOADER_DONE_EVENT = "preloader:done";

export function markPreloaderDone() {
  preloaderState.done = true;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
  }
}

/** Runs cb immediately if the preloader already finished, otherwise when it does. */
export function whenPreloaderDone(cb: () => void): () => void {
  if (preloaderState.done || typeof window === "undefined") {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(PRELOADER_DONE_EVENT, handler, { once: true });
  return () => window.removeEventListener(PRELOADER_DONE_EVENT, handler);
}
