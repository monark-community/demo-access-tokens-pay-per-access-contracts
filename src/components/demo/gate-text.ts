import type { Locale } from "@/i18n/config"
import type { AppDict } from "@/i18n/dictionaries/en"
import { t } from "@/i18n/t"
import type { Gate, AccessKey, KeyState } from "@/lib/demo/types"
import { formatAmount, formatDateTime, formatRemaining, formatUnits, formatUses } from "@/lib/format"

/** "1 hour for 12 tUSDC · up to 4 per purchase" */
export function ruleSentence(gate: Pick<Gate, "rule" | "kind">, d: AppDict, locale: Locale): string {
  const r = gate.rule
  const price = formatAmount(r.price, r.token, locale)
  if (r.mode === "forever") return t(d.app.gate.ruleForever, { price })
  const unit = formatUnits(r, gate.kind, 1, d.units)
  if (r.maxUnits <= 1) return t(d.app.gate.ruleTimeOne, { unit, price })
  return t(r.mode === "time" ? d.app.gate.ruleTime : d.app.gate.ruleUses, { unit, price, max: r.maxUnits })
}

/** Catalogue price line: "12 tUSDC per 1 hour" / "9 tDAI, yours to keep". */
export function priceLine(gate: Gate, d: AppDict, locale: Locale): string {
  const r = gate.rule
  const price = formatAmount(r.price, r.token, locale)
  if (r.mode === "forever") return t(d.app.keys.forever, { price })
  return t(d.app.keys.from, { price, unit: formatUnits(r, gate.kind, 1, d.units) })
}

/** Texts for a live stub. */
export function stubText(key: AccessKey, gate: Gate, state: KeyState, now: number, d: AppDict, locale: Locale) {
  const s = d.app.stub
  if (key.expiresAt !== null) {
    if (state === "expired") {
      return {
        remaining: "0 s",
        remainingLabel: s.left,
        caption: t(s.expiredOn, { date: formatDateTime(key.expiresAt, locale) }),
        stamp: s.expired,
      }
    }
    return {
      remaining: formatRemaining(key.expiresAt - now, d.units),
      remainingLabel: s.left,
      caption: t(s.endsOn, { date: formatDateTime(key.expiresAt, locale) }),
    }
  }
  if (key.usesLeft !== null) {
    return {
      remaining: `${key.usesLeft} / ${key.usesTotal ?? key.usesLeft}`,
      remainingLabel: s.left,
      caption: formatUses(key.usesLeft, gate.kind, d.units),
      stamp: state === "spent" ? s.spent : undefined,
    }
  }
  // The ∞ says it; the kind of key is already on the card.
  return { remaining: "∞", remainingLabel: "", caption: s.forever }
}
