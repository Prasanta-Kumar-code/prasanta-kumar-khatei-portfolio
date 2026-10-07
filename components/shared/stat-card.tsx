"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { Stat } from "@/lib/types";

/** Count-up stat card; with reduced motion it renders the final value. */
export function StatCard({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? stat.value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(stat.value);
      return;
    }
    const controls = animate(0, stat.value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, stat.value]);

  return (
    <div
      ref={ref}
      className="glass gradient-border group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_var(--glow-cyan)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/20"
      />
      <p className="tabular text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {display}
        <span className="text-primary">{stat.suffix}</span>
      </p>
      <p className="mt-3 text-sm font-medium text-muted-foreground">{stat.label}</p>
    </div>
  );
}
