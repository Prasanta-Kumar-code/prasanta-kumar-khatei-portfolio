"use client";

import { ArrowUpRight } from "lucide-react";

import { GithubIcon } from "@/components/shared/brand-icons";
import { track } from "@/lib/analytics";
import type { Project } from "@/lib/types";

/** Zero-payload SVG thumbnail - no raster asset to ship or lazy-load. */
function ProjectThumbnail({ project }: { project: Project }) {
  const from = project.gradient[0];
  const to = project.gradient[1];
  const gradientId = "grad-" + project.id;
  const patternId = "grid-" + project.id;
  const alt = "Abstract thumbnail for " + project.title;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
      <svg
        viewBox="0 0 480 270"
        role="img"
        aria-label={alt}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} stopOpacity="0.85" />
            <stop offset="100%" stopColor={to} stopOpacity="0.55" />
          </linearGradient>
          <pattern id={patternId} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="480" height="270" fill="#0a0a0a" />
        <rect width="480" height="270" fill={"url(#" + patternId + ")"} />
        <circle cx="380" cy="40" r="120" fill={"url(#" + gradientId + ")"} opacity="0.55" />
        <circle cx="70" cy="240" r="90" fill={"url(#" + gradientId + ")"} opacity="0.35" />
        <text x="40" y="170" fontSize="96" fill="rgba(255,255,255,0.90)">
          {project.glyph}
        </text>
        <rect x="40" y="196" width="180" height="6" rx="3" fill={from} opacity="0.9" />
        <rect x="40" y="214" width="120" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
    </div>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const title = project.title;
  const srSuffix = " for " + title;

  return (
    <article
      className="group glass gradient-border relative flex h-full flex-col overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_-30px_var(--glow-cyan)] sm:p-5"
      data-project={project.id}
    >
      <div className="overflow-hidden rounded-xl">
        <div className="transition-transform duration-500 group-hover:scale-[1.04]">
          <ProjectThumbnail project={project} />
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h3>
          <span aria-hidden="true" className="tabular mt-1 text-xs font-semibold text-subtle-foreground">
            {"0" + (index + 1)}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <p className="mt-4 inline-flex items-center gap-2 self-start rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          <span aria-hidden="true">&#8599;</span>
          {project.impact}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label={"Technologies used in " + title}>
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border-strong px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:text-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("project_open", { projectId: project.id, link: "github" })}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-foreground transition-colors duration-300 hover:text-primary"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
            <span className="sr-only">{srSuffix + " (opens in a new tab)"}</span>
          </a>
          <a
            href={project.caseStudyUrl}
            onClick={() => track("project_open", { projectId: project.id, link: "case-study" })}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            Case Study
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">{srSuffix}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
