import type { Project } from "@/lib/types";

export const projects: readonly Project[] = [
  {
    id: "aem-enterprise-content-platform",
    title: "AEM Enterprise Content Platform",
    description:
      "Developed scalable enterprise authoring and publishing architecture using AEM 6.5.",
    stack: ["AEM", "OSGi", "Sling", "Java"],
    impact: "Reduced content publishing effort by 45%.",
    githubUrl: "https://github.com/prasanta-khatei/aem-enterprise-content-platform",
    caseStudyUrl: "#contact",
    gradient: ["#00d4ff", "#7c3aed"],
    glyph: "◆",
  },
  {
    id: "react-spa-experience",
    title: "React SPA Experience",
    description:
      "Implemented modern SPA architecture integrated with AEM Headless and SPA Editor.",
    stack: ["React", "TypeScript", "AEM"],
    impact: "Improved page performance by 40%.",
    githubUrl: "https://github.com/prasanta-khatei/react-spa-experience",
    caseStudyUrl: "#contact",
    gradient: ["#7c3aed", "#00d4ff"],
    glyph: "▲",
  },
  {
    id: "adobe-analytics-dashboard",
    title: "Adobe Analytics Dashboard",
    description:
      "Implemented tracking architecture and analytics reporting solutions.",
    stack: ["Adobe Analytics", "JavaScript", "Data Layer"],
    impact: "Increased reporting accuracy by 35%.",
    githubUrl: "https://github.com/prasanta-khatei/adobe-analytics-dashboard",
    caseStudyUrl: "#contact",
    gradient: ["#00d4ff", "#0ea5e9"],
    glyph: "●",
  },
  {
    id: "ai-powered-development-assistant",
    title: "AI-Powered Development Assistant",
    description:
      "Built developer productivity workflows leveraging AI and automation.",
    stack: ["Python", "AI APIs", "GitHub Actions"],
    impact: "Reduced repetitive development tasks by 60%.",
    githubUrl: "https://github.com/prasanta-khatei/ai-development-assistant",
    caseStudyUrl: "#contact",
    gradient: ["#7c3aed", "#ec4899"],
    glyph: "✳",
  },
];
