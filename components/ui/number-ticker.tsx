"use client"

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"
import { useMotionOk } from "@/lib/use-motion-ok"
import { useInView, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  const format = (n: number) =>
    Intl.NumberFormat("ru-RU", { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }).format(Number(n.toFixed(decimalPlaces)))

  // Local change: the server renders the final value; counting from startValue only happens when
  // motion is allowed (`motion-ok`, set in app/layout.tsx), so no-JS and reduced-motion users see the real number.
  const animate = useMotionOk()
  useEffect(() => {
    if (animate && ref.current) ref.current.textContent = format(direction === "down" ? value : startValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (isInView && animate) {
      timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value)
      }, delay * 1000)
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [motionValue, isInView, animate, delay, value, direction, startValue])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = format(latest)
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [springValue, decimalPlaces]
  )

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)} {...props}>
      {format(direction === "down" ? startValue : value)}
    </span>
  )
}
