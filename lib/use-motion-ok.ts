import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** True once hydrated if the user allows motion (`motion-ok` is set in app/layout.tsx before first paint). */
export function useMotionOk() {
  return useSyncExternalStore(noop, () => document.documentElement.classList.contains("motion-ok"), () => false);
}
