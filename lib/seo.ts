import { profile } from "@/lib/data/profile";
import { projects } from "@/lib/data/projects";

/** JSON-LD structured data: Person + WebSite + one CreativeWork per project. */

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profile.siteUrl}/#person`,
    name: profile.name,
    jobTitle: "Senior AEM Developer",
    description: profile.summary,
    url: profile.siteUrl,
    email: "mailto:prasanta.khatei@example.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Adobe Experience Manager",
      "AEM 6.5",
      "React",
      "TypeScript",
      "Java",
      "Adobe Analytics",
      "Sling",
      "OSGi",
      "HTL",
      "Headless CMS",
      "Web Performance",
    ],
    sameAs: [profile.linkedin, profile.github],
    worksFor: {
      "@type": "Organization",
      name: "Freelance / Enterprise Consulting",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${profile.siteUrl}/#website`,
    url: profile.siteUrl,
    name: profile.name,
    description: profile.summary,
    inLanguage: "en",
    publisher: { "@id": `${profile.siteUrl}/#person` },
  };
}

export function projectsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured Projects",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        url: `${profile.siteUrl}/#projects`,
        keywords: project.stack.join(", "),
        author: { "@id": `${profile.siteUrl}/#person` },
        about: project.impact,
      },
    })),
  };
}

export function breadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${profile.siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${profile.siteUrl}/#projects` },
      { "@type": "ListItem", position: 3, name: "Contact", item: `${profile.siteUrl}/#contact` },
    ],
  };
}

export const allJsonLd = [
  personJsonLd(),
  websiteJsonLd(),
  projectsJsonLd(),
  breadcrumbJsonLd(),
];
