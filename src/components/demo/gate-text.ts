import type { Locale } from "@/i18n/config"
import type { AppDict } from "@/i18n/dictionaries/en"
import { t } from "@/i18n/t"
import type { Gate, Pass, PassState } from "@/lib/demo/types"
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
  if (r.mode === "forever") return t(d.app.passes.forever, { price })
  return t(d.app.passes.from, { price, unit: formatUnits(r, gate.kind, 1, d.units) })
}

/** Texts for a live stub. */
export function stubText(pass: Pass, gate: Gate, state: PassState, now: number, d: AppDict, locale: Locale) {
  const s = d.app.stub
  if (pass.expiresAt !== null) {
    if (state === "expired") {
      return {
        remaining: formatDateTime(pass.expiresAt, locale),
        remainingLabel: s.expired,
        caption: t(s.bought, { date: formatDateTime(pass.purchasedAt, locale) }),
        stamp: s.expired,
      }
    }
    return {
      remaining: formatRemaining(pass.expiresAt - now, d.units),
      remainingLabel: s.left,
      caption: t(s.endsOn, { date: formatDateTime(pass.expiresAt, locale) }),
    }
  }
  if (pass.usesLeft !== null) {
    return {
      remaining: `${pass.usesLeft} / ${pass.usesTotal ?? pass.usesLeft}`,
      remainingLabel: s.left,
      caption: formatUses(pass.usesLeft, gate.kind, d.units),
      stamp: state === "spent" ? s.spent : undefined,
    }
  }
  return { remaining: "∞", remainingLabel: d.modes.forever, caption: s.forever }
}
