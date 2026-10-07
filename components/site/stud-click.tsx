"use client";

import { useLayoutEffect, useRef } from "react";
import { createTimeline, type Timeline } from "animejs";
import { useMotionOk } from "@/lib/use-motion-ok";

// Side cut-away of two 2×4 bricks: the studs of the lower brick wedge between the tubes of the upper one.
const STUDS = [45, 95, 145, 195];
const TUBES = [70, 120, 170];

export function StudClick() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<Timeline | null>(null);
  const canAnimate = useMotionOk();

  const play = () => {
    const el = root.current;
    if (!el) return;
    tl.current?.revert();
    const top = el.querySelector(".top")!;
    // Reduced motion: the upper brick fades in on top, no travel or squash.
    tl.current = canAnimate
      ? createTimeline()
          .add(top, { translateY: { from: -80, to: 0 }, duration: 520, ease: "inQuad" })
          .add(top, { scaleY: [1, 0.94, 1], duration: 260, ease: "outQuad" })
          .add(el.querySelectorAll(".stud"), { fill: ["#FFFFFF", "#F2CD37"], duration: 400, ease: "outQuad" }, "<<")
          .add(el.querySelector(".click")!, { opacity: [0, 1, 1, 0], scale: [0.6, 1.15, 1, 1], duration: 900, ease: "outBack(2)" }, "<<")
      : createTimeline().add(top, { opacity: { from: 0, to: 1 }, duration: 500, ease: "linear" });
  };

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    // Show the start pose (bricks apart) right away; otherwise the joined SSR pose sits on screen until
    // the threshold is reached and then jumps apart — on a phone that reads as "already connected".
    play();
    tl.current?.pause().seek(0);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        tl.current?.play();
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      tl.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAnimate]);

  return (
    <div ref={root} className="flex flex-col gap-3">
      <svg viewBox="0 0 240 190" className="h-auto w-full max-w-[420px]" role="img" aria-labelledby="studclick-title">
        <title id="studclick-title">Разрез двух кирпичиков: шипы нижнего входят между трубками верхнего</title>
        {/* lower brick */}
        <g>
          {STUDS.map((x) => <rect key={x} className="stud" x={x - 12} y={98} width={24} height={12} rx={2} fill="#F2CD37" stroke="currentColor" strokeWidth={2} />)}
          <rect x={20} y={110} width={200} height={60} rx={3} fill="#F2CD37" stroke="currentColor" strokeWidth={2} />
        </g>
        {/* upper brick (cut away to show tubes) */}
        <g className="top" style={{ transformOrigin: "120px 110px", transformBox: "view-box" }}>
          {STUDS.map((x) => <rect key={x} x={x - 12} y={38} width={24} height={12} rx={2} fill="#C91A09" stroke="currentColor" strokeWidth={2} />)}
          <rect x={20} y={50} width={200} height={60} rx={3} fill="#C91A09" stroke="currentColor" strokeWidth={2} />
          <rect x={26} y={56} width={188} height={52} fill="#7A1005" opacity={0.55} />
          {TUBES.map((x) => <rect key={x} x={x - 15} y={56} width={30} height={54} fill="#C91A09" stroke="currentColor" strokeWidth={2} strokeDasharray="4 3" />)}
        </g>
        <text className="click" x={232} y={34} textAnchor="end" fontFamily="var(--font-rubik)" fontWeight={800} fontSize={22} fill="currentColor" opacity={0} style={{ transformOrigin: "200px 26px", transformBox: "view-box" }}>
          щёлк!
        </text>
      </svg>
      <button type="button" onClick={play} className="w-fit rounded-md border-2 border-border bg-card px-3 py-1.5 text-sm font-semibold hover:bg-muted">
        Соединить ещё раз
      </button>
    </div>
  );
}
