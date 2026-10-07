"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Central motion policy: honours the OS "reduce motion" preference.
 * Transform/layout animation is dropped, opacity transitions are retained,
 * so entrances still read without vestibular triggers.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
