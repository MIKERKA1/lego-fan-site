'use client';
// Based on React Bits "TiltedCard" (https://reactbits.dev). Local changes: renders children (our <Pic>)
// instead of a bare <img>, drops the mobile warning and cursor tooltip, and stays still under reduced motion.
import type { SpringOptions } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

const springValues: SpringOptions = { damping: 30, stiffness: 100, mass: 2 };

export default function TiltedCard({ children, scaleOnHover = 1.04, rotateAmplitude = 10 }: { children: ReactNode; scaleOnHover?: number; rotateAmplitude?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current || still) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  }

  return (
    <div
      ref={ref}
      className="h-full w-full [perspective:800px]"
      onMouseMove={handleMouse}
      onMouseEnter={() => !still && scale.set(scaleOnHover)}
      onMouseLeave={() => {
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <motion.div className="h-full w-full [transform-style:preserve-3d]" style={{ rotateX, rotateY, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
