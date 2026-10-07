"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

interface TechBadgeProps {
  label: string;
  index: number;
}

/** Floating hero chip: desynchronised sine loop, disabled under reduced motion. */
export function TechBadge({ label, index }: TechBadgeProps) {
  const reduced = useReducedMotion();
  const duration = 6 + (index % 3) * 1.6;
  const delay = index * 0.45;

  return (
    <li
      className={cn(
        "glass inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-foreground/90",
        "transition-colors duration-300 hover:border-primary/50 hover:text-primary",
        !reduced && "animate-float",
      )}
      style={
        reduced
          ? undefined
          : { animationDuration: `${duration}s`, animationDelay: `${delay}s` }
      }
    >
      <span
        aria-hidden="true"
        className="mr-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
      />
      {label}
    </li>
  );
}
