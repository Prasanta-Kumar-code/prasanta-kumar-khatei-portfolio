"use client";

import { Mail } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/shared/brand-icons";
import { track } from "@/lib/analytics";
import { profile } from "@/lib/data/profile";

const links = [
  { label: "LinkedIn", href: profile.linkedin, Icon: LinkedinIcon },
  { label: "GitHub", href: profile.github, Icon: GithubIcon },
  { label: "Email", href: "mailto:" + profile.email, Icon: Mail },
] as const;

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={"flex items-center gap-3 " + className}>
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            onClick={() => track("social_click", { network: label })}
            aria-label={label}
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-[0_12px_30px_-16px_var(--glow-cyan)]"
          >
            <Icon aria-hidden="true" className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
