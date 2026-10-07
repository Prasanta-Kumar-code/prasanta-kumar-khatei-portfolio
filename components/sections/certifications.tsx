import { CertificationCard } from "@/components/shared/certification-card";
import { MotionSection } from "@/components/shared/motion-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { certifications } from "@/lib/data/skills";

export function Certifications() {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="relative border-y border-border bg-surface/40"
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <MotionSection>
          <SectionHeading
            id="certifications"
            eyebrow="Certifications"
            title="Verified expertise."
            description="Formally recognized by Adobe for enterprise AEM Sites development."
          />
        </MotionSection>

        <div className="grid gap-6">
          {certifications.map((certification) => (
            <MotionSection key={certification.name}>
              <CertificationCard certification={certification} />
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}
