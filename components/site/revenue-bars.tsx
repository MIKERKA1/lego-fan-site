"use client";

import { MotionConfig } from "motion/react";
import { BarChart } from "@/components/charts/bar-chart";
import { BarSquares } from "@/components/charts/bar-squares";
import { ChartTooltip } from "@/components/charts/tooltip";
import { revenue } from "@/content/site";

const fmt = (v: number) => v.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Bklit bar chart in "squares" mode: every column is a stack of bricks. Loaded lazily by RevenueChart. */
export default function RevenueBars() {
  return (
    <MotionConfig reducedMotion="user">
      {/* Narrow fixed bars → small squares, so each column reads as a stack of ~10 bricks. Years are in the table below. */}
      <BarChart data={revenue} xDataKey="year" aspectRatio="16 / 9" barWidth={22} squareSnap={{ squareGap: 3 }} margin={{ top: 16, right: 8, bottom: 8, left: 8 }}>
        <BarSquares dataKey="value" fill="var(--chart-1)" squareGap={3} squareRadius={0.12} fadedOpacity={1} />
        {/* Hover/tap a column: year, revenue and growth vs the previous year (as reported by LEGO Group). No dot, no fading of other columns. */}
        <ChartTooltip
          showDatePill={false}
          showCrosshair={false}
          showDots={false}
          content={({ point }) => (
            <div className="px-3 py-2 text-sm leading-snug">
              <div className="font-semibold">{String(point.year)}</div>
              <div className="tabular-nums">{fmt(Number(point.value))} млрд DKK</div>
              <div className="tabular-nums text-chart-tooltip-muted">+{String(point.growth)}% к {Number(point.year) - 1} году</div>
            </div>
          )}
        />
      </BarChart>
    </MotionConfig>
  );
}
