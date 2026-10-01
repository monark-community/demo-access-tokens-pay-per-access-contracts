import { ImageResponse } from "next/og"

import { MARK_PATH } from "@/components/site/logo"
import { isLocale, locales } from "@/i18n/config"
import { getDictionary } from "@/i18n"

export const alt = "GatePay"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : "en"
  const d = getDictionary(locale)
  const ink = "#1B1F1C"
  const paper = "#F4F1E8"
  const verdigris = "#0E5A4E"
  const brass = "#EFDDA6"
  const brassInk = "#3B2F05"

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: paper, color: ink, padding: 72, gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="64" height="64" viewBox="0 0 32 32">
              <path fill={verdigris} fillRule="evenodd" d={MARK_PATH} />
            </svg>
            <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1.5 }}>GatePay</span>
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2 }}>{d.meta.ogTagline}</div>
          <div style={{ fontSize: 22, color: "#565B53", fontFamily: "monospace" }}>{d.common.demoBadge}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: verdigris,
              color: paper,
              borderRadius: 999,
              padding: "8px 20px",
              fontSize: 22,
              letterSpacing: 4,
              fontFamily: "monospace",
            }}
          >
            {d.app.plate.open.toUpperCase()}
          </div>
          <div style={{ display: "flex", background: brass, color: brassInk, borderRadius: 8, height: 190 }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 24, flex: 1 }}>
              <span style={{ fontSize: 18, letterSpacing: 2, fontFamily: "monospace" }}>{d.modes.time.toUpperCase()}</span>
              <span style={{ fontSize: 30, fontWeight: 800 }}>Studio B</span>
              <span style={{ fontSize: 18, fontFamily: "monospace" }}>GP-4K7Q-2M</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 10,
                width: 150,
                padding: 20,
                borderLeft: `3px dashed ${brassInk}55`,
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 700, fontFamily: "monospace" }}>2 h</span>
              <div style={{ display: "flex", gap: 5 }}>
                {[1, 1, 1, 1, 1, 1, 0, 0].map((f, i) => (
                  <div
                    key={i}
                    style={{ width: 10, height: 10, borderRadius: 999, border: `2px solid ${brassInk}`, background: f ? brassInk : "transparent" }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 20, fontFamily: "monospace", color: verdigris }}>door.unlock → 200 OK · 142 ms</div>
        </div>
      </div>
    ),
    size
  )
}
