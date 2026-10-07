"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { track } from "@/lib/analytics";
import { navLinks, profile } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#home");
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Sticky glass state. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll spy for aria-current. */
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive("#" + visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0.01, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* Mobile sheet: Escape to close, focus trapped, focus restored on close. */
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previous = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => {
      panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      previous?.focus?.();
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-3.5",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6",
          scrolled &&
            "mx-auto rounded-2xl border border-border glass-strong px-4 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.6)] sm:px-5",
          !scrolled && "px-4 sm:px-6",
        )}
        style={{ maxWidth: scrolled ? undefined : "100%" }}
      >
        <div className="flex w-full items-center justify-between gap-4 sm:gap-6">
          <a
            href="#home"
            onClick={() => track("nav_click", { label: "logo" })}
            className="focus-ring group flex items-center gap-2.5 rounded-full"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-extrabold tracking-tight text-primary-foreground shadow-[0_10px_24px_-12px_var(--glow-cyan)] transition-transform duration-300 group-hover:scale-105"
            >
              {profile.initials}
            </span>              <span className="hidden text-sm font-bold leading-tight tracking-tight text-foreground sm:block">
                {profile.name}
                <span className="block text-[11px] font-medium text-muted-foreground">
                  {profile.shortRole}
                </span>
              </span>
              <span className="sr-only">, home</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => track("nav_click", { label: link.label })}
                  className={cn(
                    "focus-ring relative inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full border border-primary/40 bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              onClick={() => track("cta_click", { label: "hire_me" })}
              className="focus-ring inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-12px_var(--glow-cyan)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              Hire Me
            </a>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setOpen((value) => !value)}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-foreground transition-colors hover:border-primary/60 hover:text-primary lg:hidden"
            >
              {open ? (
                <X aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[4.5rem] z-50 mx-4 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-background/95 p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = active === link.href;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => {
                        track("nav_click", { label: link.label, surface: "mobile" });
                        setOpen(false);
                      }}
                      className={cn(
                        "focus-ring flex min-h-11 items-center rounded-xl px-4 text-base font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href="#contact"
              onClick={() => {
                track("cta_click", { label: "hire_me_mobile" });
                setOpen(false);
              }}
              className="focus-ring mt-2 flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
            >
              Hire Me
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
