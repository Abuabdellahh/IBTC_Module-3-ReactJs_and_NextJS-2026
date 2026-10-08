// app/menu/[id]/opengraph-image.js
// Next.js file convention — automatically wired as the og:image for /menu/[id].
// No import or manual metadata entry needed; Next.js handles the route and headers.
//
// Generates a 1200×630 image from dish data so every dish gets its own
// social preview card instead of a generic site image.
//
// 1200×630 is the standard Open Graph image size — widely supported by
// Telegram, WhatsApp, Facebook, Twitter/X and LinkedIn.

import { ImageResponse } from "next/og";
import { getDish } from "../../lib/dishes";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  const name    = dish?.name    ?? "Addis Eats";
  const price   = dish?.price   ?? "";
  const summary = dish?.summary ?? "Ethiopian food delivered across Addis Ababa.";
  const cat     = dish?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #1e0a3c 0%, #3b0764 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Category badge */}
        {cat && (
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#c084fc",
              marginBottom: 20,
            }}
          >
            {cat}
          </div>
        )}

        {/* Dish name — largest element, most important signal */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.05,
            color: "#ffffff",
          }}
        >
          {name}
        </div>

        {/* Summary */}
        <div
          style={{
            fontSize: 32,
            color: "#e9d5ff",
            marginTop: 24,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {summary}
        </div>

        {/* Price + brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 48,
          }}
        >
          {price && (
            <div style={{ fontSize: 48, fontWeight: 700, color: "#c084fc" }}>
              {price} ETB
            </div>
          )}
          <div style={{ fontSize: 36, fontWeight: 700, color: "#a855f7" }}>
            🍽 Addis Eats
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
