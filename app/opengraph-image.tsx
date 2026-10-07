import { ImageResponse } from "next/og";

import { profile } from "@/lib/data/profile";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.shortRole}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0A0A0A",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(0,212,255,0.30), transparent 45%), radial-gradient(circle at 85% 80%, rgba(124,58,237,0.32), transparent 45%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "#00D4FF",
              color: "#041417",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 30, opacity: 0.85 }}>
            <span>{profile.name}</span>
            <span style={{ fontSize: 22, color: "#9CA3AF" }}>{profile.role}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.08,
          }}
        >
          <span>Building Enterprise Digital</span>
          <span>Experiences with AEM &amp; React</span>
        </div>
          <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#9CA3AF" }}>
            <span>Adobe Certified AEM Developer</span>
            <span style={{ color: "#00D4FF" }}>•</span>
            <span>{profile.locationShort}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
