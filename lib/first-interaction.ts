const EVENTS = ["pointermove", "wheel", "scroll", "touchstart", "keydown"] as const;

let interacted = false;

/**
 * Runs `cb` on the visitor's first interaction (mouse move, scroll, touch or
 * key press) — or immediately if one already happened. Real users interact
 * within milliseconds, so anything gated on this feels instant while staying
 * entirely out of the initial-load work.
 *
 * Returns a cancel function (safe to call after the callback fired).
 */
export function onFirstInteraction(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (interacted) {
    cb();
    return () => {};
  }
  const opts: AddEventListenerOptions = { passive: true };
  const handler = () => {
    interacted = true;
    remove();
    cb();
  };
  const remove = () => {
    for (const e of EVENTS) window.removeEventListener(e, handler, opts);
  };
  for (const e of EVENTS) window.addEventListener(e, handler, opts);
  return remove;
}

/** Test-only reset. */
export function resetFirstInteraction() {
  interacted = false;
}
