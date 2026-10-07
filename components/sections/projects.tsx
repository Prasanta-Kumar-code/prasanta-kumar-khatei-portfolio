import { MotionSection } from "@/components/shared/motion-section";
import { ProjectCard } from "@/components/shared/project-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { projects } from "@/lib/data/projects";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative border-y border-border bg-surface/40"
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <MotionSection>
          <SectionHeading
            id="projects"
            eyebrow="Featured Projects"
            title="Work that moved the metrics."
            description="Selected enterprise engagements across AEM architecture, React engineering, analytics and AI-assisted delivery."
          />
        </MotionSection>

        <ul className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <MotionSection as="li" key={project.id} delay={0.05 * index} className="h-full">
              <ProjectCard project={project} index={index} />
            </MotionSection>
          ))}
        </ul>
      </div>
    </section>
  );
}
