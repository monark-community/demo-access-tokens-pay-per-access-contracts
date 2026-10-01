import type { Dictionary } from "@/i18n/dictionaries/en"
import { intlLocale, type Locale } from "@/i18n/config"
import { plural, t } from "@/i18n/t"
import type { GateKind, Rule, TokenSymbol } from "@/lib/demo/types"
import { TOKENS } from "@/lib/demo/tokens"

type Units = Dictionary["units"]

export function formatAmount(amount: number, token: TokenSymbol, locale: Locale): string {
  const digits = TOKENS[token].display
  const n = new Intl.NumberFormat(intlLocale[locale], {
    maximumFractionDigits: digits,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : Math.min(2, digits),
  }).format(amount)
  return `${n} ${token}`
}

export function formatNumber(n: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(n)
}

export function formatDateTime(ms: number, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(ms)
}

export function formatDate(ms: number, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { month: "short", day: "numeric" }).format(ms)
}

export function formatClock(ms: number, locale: Locale, seconds = true): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    hour: "2-digit",
    minute: "2-digit",
    ...(seconds ? { second: "2-digit" } : {}),
    hour12: false,
  }).format(ms)
}

/** Compact remaining time: "1 h 37 min", "3 d 4 h", "42 s". */
export function formatRemaining(ms: number, units: Units): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (d > 0) return [t(units.shortD, { n: d }), h ? t(units.shortH, { n: h }) : ""].filter(Boolean).join(" ")
  if (h > 0) return [t(units.shortH, { n: h }), m ? t(units.shortM, { n: m }) : ""].filter(Boolean).join(" ")
  if (m > 0) return `${t(units.shortM, { n: m })} ${String(s % 60).padStart(2, "0")} s`
  return `${s} s`
}

/** A duration in minutes as words: "1 hour", "48 hours", "30 days". */
export function formatMinutes(minutes: number, units: Units): string {
  if (minutes % 1440 === 0 && minutes >= 1440 * 3) return plural(minutes / 1440, units.day, units.days)
  if (minutes % 60 === 0) return plural(minutes / 60, units.hour, units.hours)
  return plural(minutes, units.minute, units.minutes)
}

/** What `count` units of a rule buy, e.g. "2 hours", "5 opens", "1 post". */
export function formatUnits(rule: Rule, kind: GateKind, count: number, units: Units): string {
  if (rule.mode === "time" && rule.unitMinutes) return formatMinutes(rule.unitMinutes * count, units)
  if (rule.mode === "uses" && rule.usesPerUnit) return formatUses(rule.usesPerUnit * count, kind, units)
  return ""
}

export function formatUses(n: number, kind: GateKind, units: Units): string {
  if (kind === "room" || kind === "locker") return plural(n, units.open, units.opens)
  if (kind === "board") return plural(n, units.post, units.posts)
  return plural(n, units.use, units.uses)
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}
