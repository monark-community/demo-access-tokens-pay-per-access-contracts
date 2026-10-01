"use client"

import { useState } from "react"

import { t } from "@/i18n/t"
import { applyPurchase, checkKey, type CheckResult } from "@/lib/demo/ops"
import { isUsable, ownerOf } from "@/lib/demo/rules"
import { demoNow, getDemo } from "@/lib/demo/store"
import { roundToken } from "@/lib/demo/tokens"
import type { AccessKey, Gate, Surface } from "@/lib/demo/types"
import { useTx } from "@/lib/demo/use-tx"
import { formatAmount, formatUnits, shortAddress } from "@/lib/format"

import { useApp } from "./app-provider"

/**
 * The unlock, as a sequence: pay (if there's no usable key) → mint → key in →
 * check on-chain → open, or denied. One state machine shared by the Unlock
 * panel (the button and its story) and the reveal behind the gate.
 */
export type UnlockPhase = "idle" | "paying" | "mint" | "insert" | "check" | "open" | "denied"

export interface UnlockState {
  phase: UnlockPhase
  /** The key being used. */
  code?: string
  /** True when this unlock minted a brand-new key. */
  minted?: boolean
  result?: CheckResult
  /** Demo time the gate opened (physical gates relock 10.5 s later). */
  openedAt?: number
}

export const RELOCK_MS = 10_500

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms))

function calm(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    return false
  }
}

export function useUnlock(gate: Gate, key: AccessKey | undefined, now: number) {
  const { dict, locale } = useApp()
  const g = dict.app.gate
  const tx = useTx()
  const [state, setState] = useState<UnlockState>({ phase: "idle" })
  const usable = key ? isUsable(key, now) : false

  async function unlock(units: number) {
    // Beats are shorter when the visitor prefers reduced motion; the order stays.
    const beat = calm() ? 0.25 : 1
    let code = usable ? key?.code : undefined
    let minted = false

    if (!code) {
      const demo = getDemo()
      if (!demo) return
      const total = roundToken(units * gate.rule.price, gate.rule.token)
      const bought = gate.rule.mode === "forever" ? g.lineGetForever : formatUnits(gate.rule, gate.kind, units, dict.units)
      const owner = ownerOf(demo.owners, gate)
      setState({ phase: "paying" })
      const out: { code: string | null } = { code: null }
      const ok = await tx.run(
        {
          signer: "visitor",
          title: t(key ? g.promptRenew : g.promptBuy, { gate: gate.title }),
          movesValue: true,
          lines: [
            { label: g.linePay, value: formatAmount(total, gate.rule.token, locale) },
            { label: g.lineTo, value: `${owner.name} · ${shortAddress(gate.contract)}` },
            { label: g.lineGet, value: key ? `+ ${bought} · ${key.code}` : bought },
          ],
        },
        (r) => {
          out.code = applyPurchase(gate.id, units, r, key?.code)
        }
      )
      if (!ok || !out.code) return setState({ phase: "idle" })
      code = out.code
      minted = !key
      setState({ phase: "mint", code, minted })
      await wait(760 * beat)
    }

    setState({ phase: "insert", code, minted })
    await wait(420 * beat)
    setState({ phase: "check", code, minted })
    const result = await checkKey(gate.id, code)
    await wait(220 * beat)
    setState({ phase: result.ok ? "open" : "denied", code, minted, result, openedAt: demoNow() })
  }

  const busy = state.phase === "paying" || state.phase === "mint" || state.phase === "insert" || state.phase === "check"
  return { ...state, tx, busy, unlock, reset: () => setState({ phase: "idle" }) }
}

export type Unlock = ReturnType<typeof useUnlock>

/** Is the gate open right now? Digital stays open; a physical gate relocks after RELOCK_MS. */
export function isOpen(unlock: Pick<UnlockState, "phase" | "openedAt">, surface: Surface, now: number): boolean {
  if (unlock.phase !== "open") return false
  return surface === "digital" || now - (unlock.openedAt ?? 0) < RELOCK_MS
}
