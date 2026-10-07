import { Boxes } from "lucide-react";

import type { SkillGroup } from "@/lib/types";

export function SkillGroupCard({ group }: { group: SkillGroup }) {
  return (
    <div
      className="glass group relative flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_60px_-30px_var(--glow-cyan)]"
      data-skill-group={group.id}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20"
        >
          <Boxes className="h-4 w-4" />
        </span>
        <h3 className="text-base font-bold tracking-tight text-foreground">{group.title}</h3>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-border-strong bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-foreground"
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
