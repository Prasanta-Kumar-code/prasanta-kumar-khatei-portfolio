import type { MetadataRoute } from "next";

import { profile } from "@/lib/data/profile";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: profile.siteUrl + "/",
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...["about", "projects", "skills", "certifications", "contact"].map((section) => ({
      url: `${profile.siteUrl}/#${section}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
