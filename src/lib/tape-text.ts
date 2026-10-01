import type { AppDict as Dictionary } from "@/i18n/dictionaries/en"
import type { Locale } from "@/i18n/config"
import { t } from "@/i18n/t"
import type { Gate, LogEvent } from "@/lib/demo/types"

import { formatAmount, formatNumber, formatUnits } from "./format"

/** One gateway-tape line as text, in the visitor's language. */
export function tapeText(e: LogEvent, gate: Gate | undefined, d: Dictionary, locale: Locale): string {
  const tp = d.app.tape
  switch (e.type) {
    case "payment":
    case "renewal":
      return t(e.type === "payment" ? tp.payment : tp.renewal, {
        amount: formatAmount(e.amount, e.token, locale),
        units: gate ? formatUnits(gate.rule, gate.kind, e.units, d.units) : String(e.units),
        code: e.code,
      })
    case "check":
      return t(tp.check, { code: e.code, block: formatNumber(e.block, locale) })
    case "action":
      return t(tp.action[e.action], { hook: e.hook ?? "", status: e.httpStatus ?? 200, ms: e.ms, code: e.code })
    case "denied":
      return t(tp.denied, { code: e.code, reason: tp.reasons[e.reason] })
    case "expired":
      return t(tp.expired, { code: e.code })
    case "published":
    case "paused":
    case "resumed":
      return t(tp[e.type], { block: formatNumber(e.block, locale) })
  }
}
