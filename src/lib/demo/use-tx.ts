"use client"

import { useCallback, useState } from "react"

import { submit } from "./chain"
import { requestPrompt } from "./store"
import type { TxPhase, TxResult, TxSummary } from "./types"

export interface TxView {
  phase: TxPhase
  hash: string | null
  block: number | null
}

/**
 * One transaction from signature to inclusion:
 * signing → (rejected | pending) → (confirmed | failed).
 * `apply` runs only on confirmation, which is where state changes.
 */
export function useTx() {
  const [view, setView] = useState<TxView>({ phase: "idle", hash: null, block: null })

  const run = useCallback(async (summary: TxSummary, apply: (r: TxResult) => void): Promise<boolean> => {
    setView({ phase: "signing", hash: null, block: null })
    const approved = await requestPrompt("tx", summary)
    if (!approved) {
      setView({ phase: "rejected", hash: null, block: null })
      return false
    }
    const tx = submit()
    setView({ phase: "pending", hash: tx.hash, block: null })
    try {
      const result = await tx.wait()
      apply(result)
      setView({ phase: "confirmed", hash: result.hash, block: result.block })
      return true
    } catch {
      setView({ phase: "failed", hash: tx.hash, block: null })
      return false
    }
  }, [])

  const reset = useCallback(() => setView({ phase: "idle", hash: null, block: null }), [])

  return { ...view, run, reset, busy: view.phase === "signing" || view.phase === "pending" }
}
