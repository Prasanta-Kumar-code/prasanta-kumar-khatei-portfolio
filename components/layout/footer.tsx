import { Heart } from "lucide-react";

import { SocialLinks } from "@/components/shared/social-links";
import { navLinks, profile } from "@/lib/data/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <a
              href="#home"
              className="focus-ring inline-flex items-center gap-2.5 rounded-full"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-primary-foreground"
              >
                {profile.initials}
              </span>
              <span className="text-sm font-bold tracking-tight text-foreground">
                {profile.name}
              </span>
              <span className="sr-only">, back to top</span>
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {profile.mission}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow text-[11px] font-semibold text-subtle-foreground">Quick Links</h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {navLinks
                .filter((link) => ["#home", "#projects", "#contact"].includes(link.href))
                .map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="focus-ring inline-flex min-h-8 items-center rounded text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>

          <SocialLinks />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {year} {profile.name}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-subtle-foreground">
            Built with
            <Heart aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
            using Next.js, Tailwind CSS &amp; Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
