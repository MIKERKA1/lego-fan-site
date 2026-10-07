"use client";
// Based on Aceternity UI "Timeline" (scroll-linked progress via useScroll/useTransform),
// reworked into a brick tower: every era is a brick that drops onto the stack as you scroll past it.
import { useMotionValueEvent, useScroll, useSpring, useTransform, motion, type MotionValue } from "motion/react";
import { useMotionOk } from "@/lib/use-motion-ok";
import { useRef, useState } from "react";
import type { BrickColor, TimelineStep } from "@/content/site";
import { Sources } from "@/components/site/parts";
import { cn } from "@/lib/utils";

const COLORS: Record<BrickColor, { bg: string; fg: string }> = {
  red: { bg: "#C91A09", fg: "#FFFFFF" },
  yellow: { bg: "#F2CD37", fg: "#1B2A34" },
  blue: { bg: "#0055BF", fg: "#FFFFFF" },
  white: { bg: "#FFFFFF", fg: "#1B2A34" },
  gray: { bg: "#6C6E68", fg: "#FFFFFF" }, // LDraw Dark Bluish Gray: visible on both the light page and the black 18+ page
};
// Running-bond offsets (in studs) so the tower looks stacked, not like a list.
const LAYOUT = [[0, 6], [1, 6], [0, 5], [2, 6], [1, 5], [0, 6], [1, 6], [2, 6], [1, 5], [0, 5], [1, 6], [2, 5], [0, 6], [1, 6]];

function TowerBrick({ i, n, step, progress, active, still }: { i: number; n: number; step: TimelineStep; progress: MotionValue<number>; active: boolean; still: boolean }) {
  const start = (i - 0.4) / n, end = (i + 0.15) / n;
  const y = useTransform(progress, [start, end], [-70, 0]);
  const opacity = useTransform(progress, [start, start + 0.02], [0, 1]);
  const [off, w] = LAYOUT[i % LAYOUT.length];
  const c = COLORS[step.color];
  return (
    <motion.div
      data-color={step.color}
      className={cn("brick flex items-center px-2 text-xs font-bold transition-[outline-color] duration-200", active ? "outline outline-[3px] outline-offset-2 outline-ring" : "outline-transparent")}
      style={{ "--c": c.bg, color: c.fg, marginLeft: off * 24, width: w * 24, height: "var(--brick-h)", ...(still ? {} : { y, opacity }) } as React.CSSProperties}
    >
      {step.year}
    </motion.div>
  );
}

export const Timeline = ({ data }: { data: TimelineStep[] }) => {
  const ref = useRef<HTMLOListElement>(null);
  // Server snapshot is "still", so SSR/no-JS/reduced-motion users get the finished tower;
  // bricks are only hidden for the scroll animation once the client confirms motion is allowed.
  const still = !useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 65%"] });
  // A light spring gives each landing brick a small overshoot — the "click".
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 26, mass: 0.6 });
  const [active, setActive] = useState(-1);
  const n = data.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v <= 0 ? -1 : Math.min(n - 1, Math.floor(v * n));
    if (next !== active) setActive(next);
  });

  return (
    <div className="grid gap-10 md:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
      {/* Tower (md+) */}
      <div className="max-md:hidden">
        <div className="sticky top-24 flex h-[calc(100dvh-8rem)] max-h-[44rem] flex-col justify-end" style={{ "--brick-h": `min(34px, calc((100dvh - 14rem) / ${n} - 7px))` } as React.CSSProperties} aria-hidden="true">
          <div className="flex flex-col-reverse gap-[7px] pb-[7px]">
            {data.map((step, i) => (
              <TowerBrick key={step.year} i={i} n={n} step={step} progress={progress} active={i === active} still={still} />
            ))}
          </div>
          <div className="studs h-4 w-[216px] rounded-sm bg-[#A0A5A9]/60" />
          <p className="mt-2 text-xs text-muted-foreground">Опорная плита: Биллунн</p>
        </div>
      </div>

      {/* Steps */}
      <ol ref={ref} className="relative grid gap-14 pl-10 md:gap-24 md:pl-0">
        <span aria-hidden="true" className="absolute bottom-0 left-3 top-0 w-1 rounded-full bg-muted md:hidden">
          <motion.span className="block h-full w-full origin-top rounded-full bg-primary" style={{ scaleY: still ? 1 : scrollYProgress }} />
        </span>
        {data.map((step, i) => {
          const c = COLORS[step.color];
          return (
            <li key={step.year} className="relative" aria-current={i === active ? "step" : undefined}>
              <span aria-hidden="true" data-color={step.color} className="brick absolute -left-10 top-1 h-4 w-7 md:hidden" style={{ "--c": c.bg } as React.CSSProperties} />
              <p className="step-num text-[clamp(2.75rem,6vw,4.5rem)] tracking-[-0.03em]">{step.year}</p>
              <h3 className="mt-1 text-2xl font-bold">{step.title}</h3>
              <p className="mt-3 max-w-[58ch]">{step.text}</p>
              <Sources ids={step.facts} className="mt-3" />
            </li>
          );
        })}
      </ol>
    </div>
  );
};
