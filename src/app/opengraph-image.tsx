import { ImageResponse } from "next/og";
import { hero } from "@/data/hero";
import { brand } from "@/data/navigation";
import { profile } from "@/data/profile";
import { meta } from "@/data/site";

export const alt = meta.preview.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Drawn outside the page, where the stylesheet's variables cannot be read, so
// its colours are written out as plain values.
export default function OGImage() {
  const [, bring, deliver] = hero.headline;

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
          backgroundColor: "#110e09",
          color: "#ebe5d6",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 300,
            color: "#737373",
            marginBottom: 32,
          }}
        >
          {brand}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#b3ab9b",
            lineHeight: 1.5,
          }}
        >
          {meta.preview.line}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 22,
            color: "#f2b04a",
          }}
        >
          {bring} {deliver}
        </div>
      </div>
    ),
    { ...size },
  );
}
