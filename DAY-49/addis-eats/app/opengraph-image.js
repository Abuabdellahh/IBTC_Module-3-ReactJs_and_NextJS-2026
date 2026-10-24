// app/opengraph-image.js — the share-card image, generated once at build time.
// Inherited by every route that does not define its own, and made absolute by
// metadataBase in the root layout.

import { ImageResponse } from "next/og";

export const alt = "Addis Eats — Ethiopian food, delivered across Addis Ababa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #fdf1d3 0%, #fbe3de 60%, #f3c3b8 100%)",
          color: "#1f1a17",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, color: "#922614" }}>Addis Eats</div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 24, maxWidth: 900 }}>
          Ethiopian food, delivered across Addis Ababa.
        </div>
        <div style={{ fontSize: 32, marginTop: 32, color: "#5f5550" }}>
          Doro Wat · Kitfo · Tibs · Beyaynetu · Buna
        </div>
      </div>
    ),
    size
  );
}
