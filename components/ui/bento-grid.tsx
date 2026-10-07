// Based on Magic UI "Bento Grid" (https://magicui.design). Local changes: cards take our BentoItem
// (photo or stud background, RetroUI badge, collapsible sources) instead of icon + CTA link.
import { type ComponentPropsWithoutRef, type ReactNode } from "react"

import type { BentoItem } from "@/content/site"
import { Badge } from "@/components/ui/badge"
import { Credit, Pic, Sources } from "@/components/site/parts"
import { cn } from "@/lib/utils"

const BentoGrid = ({ children, className, ...props }: ComponentPropsWithoutRef<"ul"> & { children: ReactNode }) => (
  <ul className={cn("grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(15rem,auto)] lg:grid-cols-3 lg:grid-flow-dense", className)} {...props}>
    {children}
  </ul>
)

const SPAN = { wide: "sm:col-span-2", tall: "lg:row-span-2", full: "sm:col-span-2 lg:col-span-3", normal: "" } as const

const BentoCard = ({ item }: { item: BentoItem }) => (
  <li className={cn("callout group relative flex flex-col overflow-hidden", SPAN[item.span])}>
    {item.image ? (
      <div className={cn("relative overflow-hidden border-b-2 border-border bg-muted", item.span === "tall" ? "aspect-[4/3] lg:aspect-auto lg:min-h-0 lg:flex-1" : item.span === "wide" ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[16/10]")}>
        <Pic image={item.image} alt={item.imageAlt ?? ""} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03]" />
        {/* Parts counter from the instruction booklet, pinned over the photo. */}
        {item.stat && (
          <span className="step-num absolute bottom-3 left-3 rounded-md bg-card px-2.5 py-1.5 text-2xl text-card-foreground shadow-[0_0_0_2px_var(--border)] md:text-3xl">{item.stat}</span>
        )}
      </div>
    ) : item.stat ? (
      // Like the parts counter in an instruction booklet: the number is the picture.
      <p className="studs flex min-h-28 shrink-0 items-end border-b-2 border-border bg-muted/50 p-4">
        <span className="step-num text-[clamp(2.5rem,5vw,3.75rem)] tracking-[-0.03em]">{item.stat}</span>
      </p>
    ) : (
      <div aria-hidden="true" className="studs h-16 shrink-0 border-b-2 border-border bg-muted/50" />
    )}
    <div className="flex flex-col gap-2 p-4">
      {item.badge && <Badge variant={item.badge === "Рекорд" ? "default" : "secondary"} className="border-border">{item.badge}</Badge>}
      <h3 className={cn("font-bold leading-tight", item.span === "wide" || item.span === "full" ? "text-2xl md:text-3xl" : "text-xl")}>{item.name}</h3>
      <p className="text-[0.95rem] leading-snug text-muted-foreground">{item.text}</p>
      <Sources ids={item.facts} className="mt-1" />
      {item.imageNote && <p className="text-xs text-muted-foreground">{item.imageNote}</p>}
      {item.image && <Credit image={item.image} />}
    </div>
  </li>
)

export { BentoCard, BentoGrid }
