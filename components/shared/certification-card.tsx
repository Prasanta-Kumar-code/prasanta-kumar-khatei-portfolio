import { BadgeCheck, Award, ShieldCheck } from "lucide-react";

import type { Certification } from "@/lib/types";

export function CertificationCard({ certification }: { certification: Certification }) {
  return (
    <article className="glass gradient-border relative overflow-hidden rounded-2xl p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary"
          >
            <Award className="h-7 w-7" />
          </span>
          <div>
            <p className="eyebrow text-xs font-semibold text-primary">{certification.issuer}</p>
            <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
              {certification.name}
            </h3>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-success" />
              Status: {certification.status}
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary sm:self-auto">
          <BadgeCheck aria-hidden="true" className="h-4 w-4" />
          {certification.badge}
        </span>
      </div>
    </article>
  );
}
