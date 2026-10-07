"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { revenue } from "@/content/site";

// visx/d3 + Bklit only load when the chart approaches the viewport; the numbers are always in the table.
const RevenueBars = dynamic(() => import("./revenue-bars"), { ssr: false });

const fmt = (v: number) => v.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function RevenueChart() {
  const slot = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setNear(true);
        io.disconnect();
      }
    }, { rootMargin: "300px" });
    if (slot.current) io.observe(slot.current);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="callout p-4 md:p-6">
      <figcaption className="mb-2">
        <span className="font-heading text-lg font-bold">Выручка LEGO Group, млрд датских крон</span>
        <span className="block text-sm text-muted-foreground">2021–2025 и рост к предыдущему году, по данным годовой отчётности</span>
      </figcaption>
      <div ref={slot} aria-hidden="true" className="aspect-[16/9]">
        {near && <RevenueBars />}
      </div>
      <table className="mt-3 w-full text-sm tabular-nums">
        <caption className="sr-only">Выручка по годам, млрд DKK, и рост к предыдущему году</caption>
        <thead>
          <tr className="text-muted-foreground">
            {revenue.map((r) => <th key={r.year} scope="col" className="font-semibold">{r.year}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {revenue.map((r) => <td key={r.year} className="text-center font-semibold">{fmt(r.value)}</td>)}
          </tr>
          <tr>
            {revenue.map((r) => <td key={r.year} className="text-center text-xs font-semibold text-muted-foreground">+{r.growth}%</td>)}
          </tr>
        </tbody>
      </table>
    </figure>
  );
}
