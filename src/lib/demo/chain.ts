"use client"

import { blockAt, randomHash } from "./ids"
import { demoNow, getDemo, update } from "./store"
import type { TxResult } from "./types"

/**
 * Simulated network. A real build would replace these with viem calls:
 * submit() ≈ writeContract + waitForTransactionReceipt, read() ≈ readContract.
 */

export class NetworkError extends Error {
  constructor() {
    super("network-failure")
    this.name = "NetworkError"
  }
}

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms))

/** A signed transaction: its hash is known at once; wait() resolves on inclusion. */
export function submit(): { hash: string; wait: () => Promise<TxResult> } {
  const hash = randomHash()
  const shouldFail = getDemo()?.settings.failNext ?? false
  if (shouldFail) update((s) => ({ ...s, settings: { ...s.settings, failNext: false } }))
  return {
    hash,
    wait: async () => {
      await wait(1600 + Math.random() * 1000)
      if (shouldFail) throw new NetworkError()
      return { hash, block: blockAt(demoNow()) }
    },
  }
}

/** A contract read (free, no signature): short latency. */
export async function read(): Promise<{ block: number }> {
  await wait(550 + Math.random() * 350)
  return { block: blockAt(demoNow()) }
}

/** Wallet connection handshake latency. */
export async function handshake(): Promise<void> {
  await wait(700 + Math.random() * 400)
}
