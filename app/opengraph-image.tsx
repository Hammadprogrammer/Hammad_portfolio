import { ImageResponse } from "next/og";

export const alt = "Muhammad Hammad — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background:
            "radial-gradient(circle at 78% 28%, #10405c 0%, transparent 55%), radial-gradient(circle at 12% 82%, #2b2360 0%, transparent 50%), #04060d",
          color: "#f6f9fd",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 8,
            color: "#22e0ff",
          }}
        >
          <div style={{ width: 60, height: 2, background: "#22e0ff" }} />
          FULL STACK DEVELOPER
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 94,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          Muhammad Hammad
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 30,
            color: "#ccd6e5",
            maxWidth: 880,
            lineHeight: 1.4,
          }}
        >
          Building fast, scalable web applications — React, Next.js, TypeScript,
          ASP.NET Core and interactive 3D.
        </div>
        <div
          style={{
            marginTop: 44,
            display: "flex",
            gap: 14,
            fontSize: 20,
            color: "#8b7bff",
          }}
        >
          {["React", "Next.js", "TypeScript", ".NET", "Node.js"].map((t) => (
            <div
              key={t}
              style={{
                border: "1px solid #8b7bff66",
                borderRadius: 999,
                padding: "8px 22px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
