import type { Certification, SkillGroup } from "@/lib/types";

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    skills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3"],
  },
  {
    id: "aem",
    title: "AEM Technologies",
    skills: ["AEM 6.5", "Sling", "OSGi", "JCR", "HTL"],
  },
  {
    id: "backend",
    title: "Backend",
    skills: ["Java", "REST APIs"],
  },
  {
    id: "analytics",
    title: "Analytics",
    skills: ["Adobe Analytics", "Adobe Launch", "Data Layer"],
  },
  {
    id: "tools",
    title: "Tools",
    skills: ["Git", "GitHub", "VS Code", "IntelliJ", "Maven"],
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    skills: ["Python", "GitHub Actions", "Cursor AI", "Copilot"],
  },
];

export const certifications: readonly Certification[] = [
  {
    issuer: "Adobe",
    name: "Adobe Certified Professional — Adobe Experience Manager Sites Developer",
    status: "Verified",
    badge: "Certified Expert",
  },
];
