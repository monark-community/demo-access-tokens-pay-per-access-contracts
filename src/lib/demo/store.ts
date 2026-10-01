"use client"

import { useSyncExternalStore } from "react"

import { createSeed, type SeedCopy } from "./seed"
import type { DemoState, TxSummary } from "./types"

/**
 * The demo's single source of truth: a tiny external store persisted to
 * localStorage (every access wrapped in try/catch). Swapping to a real chain
 * means replacing this folder; components only use hooks and ops.
 */

const STORAGE_KEY = "gatepay-demo-v1"

let state: DemoState | null = null
let storageOk = true
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function persist() {
  if (!state) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    storageOk = true
  } catch {
    storageOk = false
  }
}

function load(): DemoState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DemoState
    if (parsed?.version !== 1 || !Array.isArray(parsed.gates) || !Array.isArray(parsed.passes)) return null
    // A reload never resumes a half-finished connection.
    if (parsed.wallet.status === "connecting") parsed.wallet.status = "disconnected"
    return parsed
  } catch {
    storageOk = false
    return null
  }
}

/** Load saved state, or seed the examples in the visitor's language. Idempotent. */
export function initDemo(copy: SeedCopy, locale: "en" | "fr") {
  if (state) return
  state = load() ?? createSeed(copy, locale)
  persist()
  emit()
}

export function resetDemo(copy: SeedCopy, locale: "en" | "fr") {
  const connected = state?.wallet.status === "connected"
  state = createSeed(copy, locale)
  if (connected) state.wallet.status = "connected"
  persist()
  emit()
}

export function update(fn: (s: DemoState) => DemoState) {
  if (!state) return
  state = fn(state)
  persist()
  emit()
}

export function getDemo(): DemoState | null {
  return state
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Current demo state, or null until it has loaded on the client. */
export function useDemo(): DemoState | null {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => null
  )
}

export function useStorageOk(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => storageOk,
    () => true
  )
}

/* ---------------------------------------------------------------------------
 * Demo clock: real time plus the fast-forward offset, ticking once a second.
 * ------------------------------------------------------------------------ */

let tick = 0
let tickTimer: number | null = null
const tickListeners = new Set<() => void>()

function subscribeTick(listener: () => void) {
  tickListeners.add(listener)
  if (tickTimer === null && typeof window !== "undefined") {
    tickTimer = window.setInterval(() => {
      tick++
      for (const l of tickListeners) l()
    }, 1000)
  }
  const unsubStore = subscribe(listener)
  return () => {
    tickListeners.delete(listener)
    unsubStore()
    if (tickListeners.size === 0 && tickTimer !== null) {
      window.clearInterval(tickTimer)
      tickTimer = null
    }
  }
}

/** Demo "now" in ms. Only call from client code. */
export function demoNow(): number {
  return Date.now() + (state?.settings.clockOffset ?? 0)
}

/** Demo "now", re-rendering every second. Returns 0 during SSR. */
export function useNow(): number {
  const snapshot = useSyncExternalStore(
    subscribeTick,
    () => `${tick}:${state?.settings.clockOffset ?? 0}`,
    () => "ssr"
  )
  return snapshot === "ssr" ? 0 : demoNow()
}

/* ---------------------------------------------------------------------------
 * Simulated wallet prompt: a promise resolved by the WalletPrompt dialog.
 * ------------------------------------------------------------------------ */

export interface PromptRequest {
  kind: "connect" | "tx"
  summary?: TxSummary
  resolve: (approved: boolean) => void
}

let prompt: PromptRequest | null = null
const promptListeners = new Set<() => void>()

function setPrompt(next: PromptRequest | null) {
  prompt = next
  for (const l of promptListeners) l()
}

export function requestPrompt(kind: PromptRequest["kind"], summary?: TxSummary): Promise<boolean> {
  return new Promise((resolve) => {
    prompt?.resolve(false)
    setPrompt({
      kind,
      summary,
      resolve: (ok) => {
        setPrompt(null)
        resolve(ok)
      },
    })
  })
}

export function usePrompt(): PromptRequest | null {
  return useSyncExternalStore(
    (l) => {
      promptListeners.add(l)
      return () => {
        promptListeners.delete(l)
      }
    },
    () => prompt,
    () => null
  )
}
