import { MotionSection } from "@/components/shared/motion-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { SkillGroupCard } from "@/components/shared/skill-group";
import { skillGroups } from "@/lib/data/skills";

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:py-32"
    >
      <MotionSection>
        <SectionHeading
          id="skills"
          eyebrow="Skills"
          title="A stack built for the enterprise."
          description="From AEM authoring architectures to React interfaces, analytics instrumentation and AI-assisted delivery pipelines."
        />
      </MotionSection>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <MotionSection key={group.id} delay={0.04 * index}>
            <SkillGroupCard group={group} />
          </MotionSection>
        ))}
      </div>
    </section>
  );
}
