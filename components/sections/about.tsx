import Image from "next/image";

import { MotionSection } from "@/components/shared/motion-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { profile, stats, profileImage1, profileImage2 } from "@/lib/data/profile";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:py-32"
    >
      <MotionSection>
        <SectionHeading
          id="about"
          eyebrow="About"
          title="Enterprise engineering, human outcomes."
          description={profile.mission}
        />
      </MotionSection>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <MotionSection delay={0.05}>
          <div className="glass gradient-border relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-primary/15 blur-3xl"
            />
            <p className="relative text-base leading-relaxed text-muted-foreground sm:text-lg">
              {profile.about}
            </p>

            <h3 className="relative mt-8 text-sm font-bold uppercase tracking-widest text-primary">
              Highlights
            </h3>
            <ul className="relative mt-4 grid gap-2.5 sm:grid-cols-2">
              {profile.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </MotionSection>

        <div className="grid gap-5 sm:grid-cols-2 lg:content-start">
          <MotionSection delay={0.06}>
            <div className="glass gradient-border relative overflow-hidden rounded-2xl p-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image
                  src={profileImage1}
                  alt="Portrait of Prasanta Kumar Khatei on a city street at night"
                  fill
                  sizes="(min-width: 1024px) 280px, 100%"
                  className="object-cover"
                />
              </div>
              <p className="relative mt-3 text-center text-xs font-medium text-muted-foreground">
                Night street portrait
              </p>
            </div>
          </MotionSection>
          <MotionSection delay={0.09}>
            <div className="glass gradient-border relative overflow-hidden rounded-2xl p-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image
                  src={profileImage2}
                  alt="Portrait of Prasanta Kumar Khatei at a desk in an office"
                  fill
                  sizes="(min-width: 1024px) 280px, 100%"
                  className="object-cover"
                />
              </div>
              <p className="relative mt-3 text-center text-xs font-medium text-muted-foreground">
                Office desk portrait
              </p>
            </div>
          </MotionSection>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <MotionSection key={stat.label} delay={0.06 * index}>
            <StatCard stat={stat} />
          </MotionSection>
        ))}
      </div>
    </section>
  );
}
