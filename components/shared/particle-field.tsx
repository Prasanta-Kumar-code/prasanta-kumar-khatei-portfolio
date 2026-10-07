"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
}

/**
 * Lightweight ambient particle canvas (~40 dots).
 * Pauses when off-screen and renders nothing under reduced motion.
 */
export function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let frame = 0;
    let running = true;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(40, Math.max(18, Math.round((width * height) / 26000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.4 + 0.18,
      }));
    };

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue("--primary").trim() || "#00d4ff";

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;
        if (p.y < -4) p.y = height + 4;
        if (p.y > height + 4) p.y = -4;

        ctx.globalAlpha = p.a;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = window.requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden && running) {
        running = false;
        window.cancelAnimationFrame(frame);
      } else if (!document.hidden && !running) {
        running = true;
        tick();
      }
    };

    resize();

    // Defer the animation loop until the page has fully loaded so particle work
    // never competes with initial rendering/paint.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      tick();
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !running) {
          running = true;
          start();
        } else if (!entry.isIntersecting && running) {
          running = false;
          window.cancelAnimationFrame(frame);
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    const onLoad = () => start();
    window.addEventListener("load", onLoad);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className={className} data-particle-field />
  );
}
