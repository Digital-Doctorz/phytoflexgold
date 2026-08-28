import { ImageResponse } from "next/og"

export const alt = "PhytoFlex Gold - Clinical-Grade Joint & Mobility Supplement"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "56px 64px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1c1c 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ff6b35",
              borderRadius: 16,
              color: "#0a0a0a",
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            P
          </div>
          <div style={{ color: "#e9c349", fontSize: 22, fontWeight: 600, letterSpacing: 4 }}>
            LIQUID HEALTH
          </div>
        </div>
        <div style={{ color: "#e2e2e2", fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>
          PhytoFlex Gold
        </div>
        <div style={{ color: "#ffb59d", fontSize: 34, marginTop: 20, lineHeight: 1.3 }}>
          Restore Joint, Nerve &amp; Muscle Vitality
        </div>
        <div style={{ width: 120, height: 6, background: "#ff6b35", borderRadius: 3, marginTop: 36 }} />
      </div>
    ),
    { ...size }
  )
}