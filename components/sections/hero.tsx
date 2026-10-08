"use client";

import { ArrowLeftRight, ArrowRight, Download, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { AuroraBackdrop } from "@/components/shared/aurora-bg";
import { ParticleField } from "@/components/shared/particle-field";
import { TechBadge } from "@/components/shared/tech-badge";
import { track } from "@/lib/analytics";
import { profile, profileImage1, profileImage2, techBadges } from "@/lib/data/profile";
import { withBasePath } from "@/lib/utils";

/** Hero entrances are CSS-driven (not framer-motion) so the headline paints on
 * first render instead of waiting for hydration - that is the LCP element. */
const rise = (delayMs: number) => ({ animationDelay: delayMs + "ms" });

export function Hero() {
  const [activeImage, setActiveImage] = useState<string>(profileImage1);

  return (
    <section id="home" aria-labelledby="home-heading" className="relative overflow-hidden">
      <AuroraBackdrop />
      <ParticleField className="absolute inset-0 h-full w-full" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-32 sm:px-6 sm:pt-36 lg:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p
              className="hero-rise inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary"
              style={rise(0)}
            >
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Adobe Certified AEM Developer
            </p>

            <h1
              id="home-heading"
              className="hero-rise mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              style={rise(60)}
            >
              Building Enterprise Digital Experiences with{" "}
              <span className="text-gradient">AEM &amp; React</span>
            </h1>

            <p
              className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={rise(140)}
            >
              Adobe Certified AEM Developer creating scalable, data-driven, and high-performance
              web experiences for global enterprises.
            </p>

            <p className="hero-rise mt-4" style={rise(200)}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-sm font-medium text-muted-foreground">
                <MapPin aria-hidden="true" className="h-4 w-4 text-primary" />
                {profile.locationShort}
              </span>
            </p>

            <div className="hero-rise mt-8 flex flex-wrap items-center gap-4" style={rise(260)}>
              <a
                href="#projects"
                onClick={() => track("cta_click", { label: "view_projects" })}
                className="focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_14px_38px_-14px_var(--glow-cyan)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
              >
                View Projects
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href={withBasePath(profile.resumeHref)}
                download
                onClick={() => track("resume_download", { source: "hero" })}
                className="focus-ring inline-flex h-12 items-center gap-2 rounded-full border border-border-strong px-7 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Download Resume
              </a>
            </div>

            <ul
              className="hero-rise mt-10 flex flex-wrap gap-3"
              style={rise(320)}
              aria-label="Core technologies"
            >
              {techBadges.map((badge, index) => (
                <TechBadge key={badge.label} label={badge.label} index={index} />
              ))}
            </ul>
          </div>

          <aside className="hero-rise relative mx-auto w-full max-w-md lg:max-w-none" style={rise(200)}>
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-secondary/30 blur-2xl"
            />
            <div className="glass gradient-border relative rounded-[1.75rem] p-5">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
                <Image
                  src={activeImage}
                  alt="Professional profile portrait of Prasanta Kumar Khatei"
                  width={640}
                  height={560}
                  priority
                  className="h-auto w-full"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold leading-tight tracking-tight text-foreground">
                    {profile.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{profile.shortRole}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft"
                  />
                  Available
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <a
                  href={profileImage1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-full border border-border-strong px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  aria-label="View full profile image 1"
                >
                  Street at night
                </a>
                <a
                  href={profileImage2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-full border border-border-strong px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  aria-label="View full profile image 2"
                >
                  Office desk
                </a>
                <button
                  type="button"
                  onClick={() => setActiveImage((current) => (current === profileImage1 ? profileImage2 : profileImage1))}
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  aria-label="Switch profile photo"
                >
                  <ArrowLeftRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
                <div>
                  <dt className="text-[11px] text-subtle-foreground">Projects</dt>
                  <dd className="tabular text-base font-bold text-foreground">20+</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-subtle-foreground">Years</dt>
                  <dd className="tabular text-base font-bold text-foreground">3+</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-subtle-foreground">Certified</dt>
                  <dd className="tabular text-base font-bold text-foreground">1+</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
