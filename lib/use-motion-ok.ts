import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: no-preference)";
const subscribe = (cb: () => void) => {
  const mq = matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** True once hydrated if the user allows motion. Reads the media query itself rather than the `motion-ok`
 *  class on <html>: React owns that element and drops the class if it ever re-renders the document. */
export function useMotionOk() {
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => false);
}
