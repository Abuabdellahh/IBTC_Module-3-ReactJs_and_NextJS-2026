// app/opengraph-image.js
// Site-wide Open Graph image — used by the homepage and any page that does
// not define its own more specific OG image.
// Next.js file convention: no import or metadata entry needed.

import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e0a3c 0%, #3b0764 100%)",
          color: "white",
          fontFamily: "sans-serif",
          textAlign: "center",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 8 }}>🍽</div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          Addis Eats
        </div>

        <div
          style={{
            fontSize: 40,
            color: "#e9d5ff",
            marginTop: 28,
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Ethiopian food delivered across Addis Ababa
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#a855f7",
            marginTop: 40,
            fontWeight: 600,
          }}
        >
          addiseats.et
        </div>
      </div>
    ),
    { ...size }
  );
}
