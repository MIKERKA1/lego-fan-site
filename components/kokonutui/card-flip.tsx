"use client";

/**
 * Based on Kokonut UI "Card Flip" (@dorianbaffier, MIT, https://kokonutui.com).
 * Changes: flips on a real button (mouse, keyboard and touch alike) instead of hover,
 * the hidden face is `inert`, styled as an instruction-booklet callout.
 */
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { FirstCard } from "@/content/site";
import { Pic } from "@/components/site/parts";
import { DuckBricks, DUCK_VIEWBOX } from "@/components/site/iso";
import { cn } from "@/lib/utils";

export default function CardFlip({ card }: { card: FirstCard }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const face = "absolute inset-0 flex flex-col overflow-hidden callout [backface-visibility:hidden]";

  return (
    <div className="group relative h-[24rem] w-full [perspective:2000px]">
      <div
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d]",
          "transition-[transform] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none",
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        )}
      >
        {/* Front */}
        <div className={face} inert={isFlipped} aria-hidden={isFlipped}>
          {card.image ? (
            <div className="h-40 shrink-0 overflow-hidden border-b-2 border-border bg-muted">
              <Pic image={card.image} alt={card.imageAlt ?? ""} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-full object-cover" />
            </div>
          ) : card.illustration === "duck" ? (
            <div className="studs h-40 shrink-0 border-b-2 border-border bg-muted/50 p-2">
              <svg viewBox={DUCK_VIEWBOX} className="mx-auto h-full w-auto" role="img" aria-label="Утка на колёсиках, пересобранная из кирпичиков (иллюстрация)">
                <DuckBricks />
              </svg>
            </div>
          ) : (
            <div aria-hidden="true" className="studs h-40 shrink-0 border-b-2 border-border bg-muted/50" />
          )}
          <div className="flex flex-1 flex-col p-4 pb-14">
            <p className="step-num text-4xl">{card.year}</p>
            <h3 className="mt-1 text-xl font-bold leading-tight">{card.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-snug text-muted-foreground">{card.front}</p>
          </div>
        </div>

        {/* Back */}
        <div className={cn(face, "[transform:rotateY(180deg)] p-4 pb-14")} inert={!isFlipped} aria-hidden={!isFlipped}>
          <p className="step-num text-4xl">{card.year}</p>
          <h3 className="mt-1 text-xl font-bold leading-tight">{card.title}</h3>
          <ul className="mt-3 grid gap-2">
            {card.back.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-[1px] bg-brick-red" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsFlipped((f) => !f)}
        aria-pressed={isFlipped}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-md border-2 border-border bg-card px-2.5 py-1.5 text-sm font-semibold hover:bg-muted"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        {isFlipped ? "Назад" : "Подробнее"}
        <span className="sr-only">: {card.title}</span>
      </button>
    </div>
  );
}
