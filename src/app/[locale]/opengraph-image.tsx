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
  // Aquamarine keys palette (globals.css, light theme), resolved to hex for Satori.
  const ink = "#0E2120"
  const ground = "#F1F9F7"
  const aqua = "#007463"
  const key = "#AFEED9"
  const keyInk = "#00322B"
  const muted = "#4E6262"

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: ground, color: ink, padding: 72, gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 620 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="64" height="64" viewBox="0 0 32 32">
              <path fill={aqua} fillRule="evenodd" d={MARK_PATH} />
            </svg>
            <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1.5, fontFamily: "monospace" }}>GatePay</span>
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2 }}>{d.meta.ogTagline}</div>
          <div style={{ fontSize: 22, color: muted, fontFamily: "monospace" }}>{d.common.demoBadge}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: aqua,
              color: ground,
              borderRadius: 999,
              padding: "8px 20px",
              fontSize: 22,
              letterSpacing: 4,
              fontFamily: "monospace",
            }}
          >
            {d.app.plate.open.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: key, color: keyInk, borderRadius: 14, height: 210, padding: 26 }}>
            <span style={{ fontSize: 18, letterSpacing: 2, fontFamily: "monospace" }}>{d.modes.uses.toUpperCase()}</span>
            <span style={{ fontSize: 30, fontWeight: 800 }}>{d.home.hero.physical}</span>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontFamily: "monospace" }}>
              <span>GP-4K7Q-2M</span>
              <span>{d.home.hero.keyLeft}</span>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {[1, 1, 1, 0, 0, 0, 0, 0, 0, 0].map((f, i) => (
                <div key={i} style={{ flex: 1, height: 10, borderRadius: 3, border: `2px solid ${keyInk}`, background: f ? keyInk : "transparent" }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 20, fontFamily: "monospace", color: aqua }}>gate.unlock → 200 OK · 142 ms</div>
        </div>
      </div>
    ),
    size
  )
}
