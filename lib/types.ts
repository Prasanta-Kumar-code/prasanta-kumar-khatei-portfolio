/** Shared domain types for the portfolio. */

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export interface TechBadge {
  readonly label: string;
}

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly stack: readonly string[];
  /** Business outcome, rendered as the headline metric on the card. */
  readonly impact: string;
  readonly githubUrl: string;
  readonly caseStudyUrl: string;
  /** Two-stop gradient used to render the zero-payload SVG thumbnail. */
  readonly gradient: readonly [string, string];
  readonly glyph: string;
}

export interface SkillGroup {
  readonly id: string;
  readonly title: string;
  readonly skills: readonly string[];
}

export interface Stat {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
}

export interface Certification {
  readonly issuer: string;
  readonly name: string;
  readonly status: string;
  readonly badge: string;
}

export type FormStatus = "idle" | "submitting" | "success" | "error";

export interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

export type ContactField = keyof ContactFormData;
