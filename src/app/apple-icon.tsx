import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ff6b35",
            borderRadius: 32,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#0a0a0a",
              fontFamily: "system-ui, sans-serif",
              lineHeight: 1,
            }}
          >
            P
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}