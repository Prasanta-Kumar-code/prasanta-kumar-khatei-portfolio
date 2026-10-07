/**
 * Analytics-ready seam.
 *
 * No vendor is wired up by default: `track()` buffers events into an
 * Adobe-Launch-style `window.dataLayer`, so dropping in GA4, Vercel Analytics
 * or Adobe Datafeed later requires zero call-site changes.
 * Respects Do Not Track / Global Privacy Control.
 */

export type AnalyticsEventName =
  | "page_view"
  | "nav_click"
  | "cta_click"
  | "project_view"
  | "project_open"
  | "theme_toggle"
  | "resume_download"
  | "social_click"
  | "contact_submit"
  | "contact_error";

export interface AnalyticsEvent {
  readonly event: AnalyticsEventName;
  readonly [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function privacyOptOut(): boolean {
  if (typeof window === "undefined") return true;
  const win = window as unknown as { doNotTrack?: string };
  const nav = window.navigator as unknown as {
    doNotTrack?: string;
    globalPrivacyControl?: boolean;
  };
  const dnt = win.doNotTrack === "1" || nav.doNotTrack === "1" || nav.doNotTrack === "yes";
  const gpc = nav.globalPrivacyControl;
  return Boolean(dnt || gpc);
}

/** Push a structured event to the analytics layer. Never throws. */
export function track(event: AnalyticsEventName, params: Record<string, string | number | boolean | undefined> = {}): void {
  if (typeof window === "undefined" || privacyOptOut()) return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ ...params, event, ts: Date.now() });
    window.dispatchEvent(new CustomEvent("portfolio:analytics", { detail: { event, params } }));
  } catch {
    /* analytics must never break the experience */
  }
}

/** Seed the data layer with the Adobe Launch page-context shape. */
export function initAnalytics(pageName: string): void {
  if (typeof window === "undefined" || privacyOptOut()) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "page_view",
    pageName,
    pageType: "portfolio",
    siteSection: "home",
    environment: process.env.NODE_ENV,
  });
}
