import type { NavLink, Stat, TechBadge } from "@/lib/types";

// Canonical URL of the deployed site. GitHub Project Pages live under a
// /<repo-name> sub-path, so the path is part of the URL. Override with
// NEXT_PUBLIC_SITE_URL once a custom domain is attached.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://prasanta-kumar-code.github.io/prasanta-kumar-khatei-portfolio";

/**
 * Scheme + host only, with no base path. Next.js applies the base path to its
 * own routes and assets by itself, so a `metadataBase` that already contains it
 * makes generated URLs (the Open Graph image, for one) double-prefixed.
 */
export const siteOrigin = new URL(siteUrl).origin;

export const profile = {
  name: "Prasanta Kumar Khatei",
  initials: "PK",
  role: "Senior AEM Developer | Adobe Experience Manager Specialist | Frontend Engineer",
  shortRole: "Senior AEM Developer & Frontend Engineer",
  location: "Bangalore, Karnataka, India",
  locationShort: "Bangalore, India",
  summary:
    "I design and develop scalable enterprise digital experiences using Adobe Experience Manager (AEM), React, Adobe Analytics, and modern web technologies. I specialize in building performant, maintainable, and user-centric solutions for global enterprises while integrating analytics, personalization, and automation to drive measurable business outcomes.",
  mission:
    "Transform complex business requirements into elegant, high-performing digital experiences.",
  about:
    "I am an Adobe Certified AEM Developer passionate about creating enterprise-grade digital experiences that balance performance, scalability, and usability. My experience spans Adobe Experience Manager, React development, analytics integrations, and modern frontend engineering practices. I enjoy solving complex technical challenges and continuously exploring AI-powered development workflows to improve productivity and deliver business value.",
  email: "prasantkumarkhatei9@gmail.com",
  phone: "+91 7682976781",
  linkedin: "https://www.linkedin.com/in/prasanta-kumar-khatei-b03b66220/",
  github: "https://github.com/Prasanta-Kumar-code",
  siteUrl,
  resumeHref: "/resume/Prasanta_Kumar_Khatei_Resume.pdf",
  highlights: [
    "Adobe Certified AEM Sites Developer Professional",
    "Experience working on T-Mobile project",
    "Experience working on EPIROC project",
    "Expertise in AEM 6.5",
    "React SPA Editor implementation experience",
    "Adobe Analytics integration experience",
    "Full-stack Java development with Spring Boot",
    "Data-driven development with SQL",
    "Automation scripting with Shell",
    "Frontend development with React",
    "Python automation enthusiast",
    "Passionate about AI-powered development workflows",
    "Tooling: GitLab CI, Jira, Confluence",
  ],
} as const;

export const navLinks: readonly NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const techBadges: readonly TechBadge[] = [
  { label: "AEM" },
  { label: "React" },
  { label: "Java" },
  { label: "Adobe Analytics" },
  { label: "JavaScript" },
  { label: "Python" },
];

export const stats: readonly Stat[] = [
  { value: 20, suffix: "+", label: "Projects Delivered" },
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 1, suffix: "+", label: "Certifications" },
  { value: 10, suffix: "+", label: "Technologies" },
];
