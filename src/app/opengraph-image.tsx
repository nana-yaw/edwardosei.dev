import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "D.O-N.E — Edward Osei-Nyarko, Backend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          backgroundColor: "#0a0a0a",
          color: "#f0f0f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 300,
            letterSpacing: "0.3em",
            color: "#737373",
            marginBottom: 32,
          }}
        >
          D.O-N.E
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
          Edward Osei-Nyarko
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#8888a0",
            lineHeight: 1.5,
          }}
        >
          Backend engineer building production systems that serve communities.
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 48,
            fontSize: 18,
            color: "#4f7df5",
          }}
        >
          <span>42 tables</span>
          <span style={{ color: "#737373" }}>/</span>
          <span>280+ tests</span>
          <span style={{ color: "#737373" }}>/</span>
          <span>6 security layers</span>
          <span style={{ color: "#737373" }}>/</span>
          <span>4 themes</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
