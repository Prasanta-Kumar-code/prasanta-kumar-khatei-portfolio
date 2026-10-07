"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        track("cta_click", { label: "back_to_top" });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      aria-label="Back to top"
      className="focus-ring fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-surface/80 text-primary shadow-[0_16px_40px_-18px_var(--glow-cyan)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"
    >
      <ArrowUp aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}
