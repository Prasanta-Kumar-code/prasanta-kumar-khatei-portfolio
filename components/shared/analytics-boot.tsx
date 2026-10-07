"use client";

import { useEffect } from "react";

import { initAnalytics } from "@/lib/analytics";

/** Seeds the analytics data layer once the app hydrates. */
export function AnalyticsBoot() {
  useEffect(() => {
    initAnalytics("Home");
  }, []);

  return null;
}
