"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { animate, createTimeline, stagger, utils, type Timeline } from "animejs";
import { DotPattern } from "@/components/ui/dot-pattern";
import { DuckBricks, DUCK_VIEWBOX } from "./iso";
import { cn } from "@/lib/utils";
import { useMotionOk } from "@/lib/use-motion-ok";

// Pull-along duck (1935), rebuilt in bricks. Each step = one bag of parts in the "instructions".
const STEPS = [
  { title: "Тележка", parts: "1× 2×6 синий, 2× колесо" },
  { title: "Корпус", parts: "2× 2×5 жёлтый, 1× 2×1 жёлтый" },
  { title: "Голова", parts: "2× 2×2 жёлтый, 1× 1×2 красный" },
];

const DROP = { translateY: { from: -160, to: 0 }, opacity: { from: 0, to: 1, duration: 120, ease: "linear" }, duration: 420, ease: "outBack(1.6)" } as const;

export function Hero() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<Timeline | null>(null);
  const shownRef = useRef(3); // how many steps are assembled right now
  const [step, setStep] = useState(3);
  const animated = useMotionOk();

  const parts = (keep: (s: number) => boolean) =>
    [...(svgRef.current?.querySelectorAll<SVGGElement>("[data-step]") ?? [])].filter((g) => keep(Number(g.dataset.step)));

  const show = (n: number) => {
    shownRef.current = n;
    setStep(n);
  };

  /** Full assembly from an empty plate: on load and via "Собрать ещё раз". */
  const play = () => {
    tlRef.current?.pause();
    utils.set(parts(() => true), { opacity: 0, translateY: 0 });
    show(0);
    const tl = createTimeline({ defaults: { duration: 420, ease: "outBack(1.6)" } });
    [1, 2, 3].forEach((n) => {
      tl.call(() => show(n), n === 1 ? 0 : "+=150").add(parts((s) => s === n), { ...DROP, delay: stagger(110) });
    });
    tlRef.current = tl;
  };

  /** Clicking step n shows the duck assembled up to that step: missing bricks drop in, extra ones lift away. */
  const goTo = (n: number) => {
    tlRef.current?.pause();
    tlRef.current = null;
    const prev = shownRef.current;
    show(n);
    const keep = parts((s) => s <= Math.min(prev, n));
    const add = parts((s) => s > prev && s <= n);
    const remove = parts((s) => s > n);
    utils.set(keep, { opacity: 1, translateY: 0 }); // settle anything a paused timeline left mid-flight
    if (!animated) {
      utils.set(add, { opacity: 1, translateY: 0 });
      utils.set(remove, { opacity: 0, translateY: 0 });
      return;
    }
    if (remove.length) animate(remove, { opacity: 0, translateY: -60, duration: 260, ease: "in(2)", delay: stagger(40, { reversed: true }) });
    if (add.length) animate(add, { ...DROP, delay: stagger(110) });
  };

  // Layout effect: take over from the CSS pre-hide before the first paint, then assemble.
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!animated || !svg) return;
    svg.classList.add("duck-js");
    play();
    return () => {
      tlRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated]);

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b-2 border-border">
      <DotPattern width={24} height={24} cx={12} cy={12} cr={6} className="-z-10 text-foreground/[0.07] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:px-8 md:pb-20 md:pt-16">
        <div className="min-w-0">
          <p className="mb-5 inline-flex items-center gap-2 text-sm font-semibold">
            <span className="step-num grid h-8 w-7 place-items-center rounded-[4px_4px_8px_8px] border-2 border-border bg-card text-base" aria-hidden="true">0</span>
            Обложка инструкции
          </p>
          <h1 id="hero-title" className="text-[clamp(2.4rem,10.5vw,4.25rem)] font-extrabold leading-[0.95] tracking-[-0.02em] md:text-[clamp(2.75rem,4.9vw,4.25rem)]">
            Кирпичик за&nbsp;кирпичиком
          </h1>
          <p className="mt-5 max-w-[34ch] text-lg text-muted-foreground">
            История LEGO как инструкция по сборке: от деревянной утки 1935&nbsp;года до набора на 12&nbsp;060 деталей.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#bio" className="inline-flex h-12 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground shadow-[inset_0_-4px_0_rgb(0_0_0/0.25)] transition-[transform,background-color] hover:bg-primary/90 active:translate-y-px">
              Открыть пакет 1
            </a>
            <a href="#sources" className="inline-flex h-12 items-center rounded-md px-5 font-semibold underline-offset-4 hover:underline">
              Источники
            </a>
          </div>
        </div>

        <figure className="callout studs relative min-w-0 p-4 md:p-6">
          <ol className="mb-2 grid grid-cols-3 gap-2" aria-label="Шаги сборки утки: выберите шаг, чтобы собрать утку до него">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const current = step === n;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => goTo(n)}
                    aria-pressed={current}
                    className={cn(
                      "h-full w-full rounded-md p-2 text-left transition-colors duration-200",
                      current ? "bg-secondary text-secondary-foreground shadow-[inset_0_0_0_2px_var(--border)]" : step > n ? "bg-card hover:bg-muted" : "bg-muted/60 hover:bg-muted"
                    )}
                  >
                    <span className="step-num text-2xl">{n}</span>
                    <span className="block text-sm font-semibold leading-tight">{s.title}</span>
                    <span className={cn("block text-xs leading-snug max-sm:hidden", current ? "text-secondary-foreground" : "text-muted-foreground")}>{s.parts}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <svg ref={svgRef} viewBox={DUCK_VIEWBOX} className="duck-svg mx-auto block h-auto w-full max-w-[460px]" aria-hidden="true">
            <DuckBricks partClassName="duck-part" />
          </svg>
          <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>Утка на колёсиках — одна из первых игрушек мастерской (1935), пересобранная из кирпичиков. Нажмите на шаг, чтобы собрать её по частям.</span>
            {animated && (
              <button type="button" onClick={play} className="shrink-0 rounded-md border-2 border-border bg-card px-3 py-1.5 font-semibold text-foreground hover:bg-muted">
                Собрать ещё раз
              </button>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
