import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Compose class names with Tailwind conflict resolution (shadcn convention). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Deployment base path. GitHub Project Pages serve the site from
 * /<repo-name>, and Next.js only rewrites module/asset URLs — plain anchors to
 * files in `public/` keep their literal path and would 404 under a base path.
 * Empty string means the site is served from the domain root.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix an in-app absolute path (e.g. "/resume/cv.pdf") with the base path. */
export function withBasePath(path: string): string {
  if (!basePath) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
