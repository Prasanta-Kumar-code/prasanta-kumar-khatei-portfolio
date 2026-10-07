"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: render a stable placeholder until mounted.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        const next = isDark ? "light" : "dark";
        setTheme(next);
        track("theme_toggle", { theme: next });
      }}
      className={
        "focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-muted-foreground transition-all duration-300 hover:border-primary/60 hover:text-primary " +
        className
      }
    >
      {mounted ? (
        isDark ? (
          <Sun aria-hidden="true" className="h-[18px] w-[18px]" />
        ) : (
          <Moon aria-hidden="true" className="h-[18px] w-[18px]" />
        )
      ) : (
        <span aria-hidden="true" className="block h-[18px] w-[18px] rounded-full border border-border-strong" />
      )}
    </button>
  );
}
