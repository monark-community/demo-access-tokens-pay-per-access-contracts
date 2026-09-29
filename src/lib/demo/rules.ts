import type { DenyReason, Gate, GateAction, GateKind, Pass, PassState, Rule } from "./types"

export const KIND_ACTION: Record<GateKind, GateAction> = {
  room: "unlock",
  locker: "unlock",
  stream: "play",
  video: "play",
  document: "reveal",
  board: "broadcast",
}

export const KIND_HOOK: Partial<Record<GateKind, string>> = {
  room: "door.unlock",
  locker: "locker.open",
}

export const KINDS: GateKind[] = ["room", "locker", "stream", "video", "document", "board"]

/** Share of the pass left, 0..1 (1 for forever). */
export function remainingShare(pass: Pass, now: number): number {
  if (pass.expiresAt !== null) {
    const total = pass.expiresAt - pass.purchasedAt
    if (total <= 0) return 0
    return Math.max(0, Math.min(1, (pass.expiresAt - now) / total))
  }
  if (pass.usesLeft !== null && pass.usesTotal) return pass.usesLeft / pass.usesTotal
  return 1
}

export function passState(pass: Pass, now: number): PassState {
  if (pass.expiresAt !== null) {
    if (now >= pass.expiresAt) return "expired"
    return remainingShare(pass, now) <= 0.15 ? "low" : "active"
  }
  if (pass.usesLeft !== null) {
    if (pass.usesLeft <= 0) return "spent"
    return pass.usesLeft === 1 ? "low" : "active"
  }
  return "forever"
}

export function isUsable(pass: Pass, now: number): boolean {
  const s = passState(pass, now)
  return s === "active" || s === "low" || s === "forever"
}

/** What the gateway decides for a code at a gate. Pure: no state changes. */
export function verify(
  gate: Gate | undefined,
  pass: Pass | undefined,
  now: number
): { ok: true; pass: Pass } | { ok: false; reason: DenyReason; pass?: Pass } {
  if (!gate || !pass) return { ok: false, reason: "unknown" }
  if (pass.gateId !== gate.id) return { ok: false, reason: "wrongGate", pass }
  const s = passState(pass, now)
  if (s === "expired") return { ok: false, reason: "expired", pass }
  if (s === "spent") return { ok: false, reason: "spent", pass }
  return { ok: true, pass }
}

/** The holder's most useful pass for a gate: usable first, then the latest. */
export function bestPass(passes: Pass[], gateId: string, holder: string, now: number): Pass | undefined {
  const mine = passes.filter((p) => p.gateId === gateId && p.holder.toLowerCase() === holder.toLowerCase())
  const usable = mine.filter((p) => isUsable(p, now))
  const pool = usable.length ? usable : mine
  return pool.sort((a, b) => b.purchasedAt - a.purchasedAt)[0]
}

/** New end date or uses after buying `units` more on top of an existing pass. */
export function extendPass(pass: Pass, rule: Rule, units: number, now: number): Pick<Pass, "expiresAt" | "usesLeft" | "usesTotal"> {
  if (rule.mode === "time" && rule.unitMinutes) {
    const from = Math.max(now, pass.expiresAt ?? now)
    return { expiresAt: from + units * rule.unitMinutes * 60_000, usesLeft: null, usesTotal: null }
  }
  if (rule.mode === "uses" && rule.usesPerUnit) {
    const add = units * rule.usesPerUnit
    const left = Math.max(0, pass.usesLeft ?? 0)
    return { expiresAt: null, usesLeft: left + add, usesTotal: left + add }
  }
  return { expiresAt: null, usesLeft: null, usesTotal: null }
}

/** Fresh pass terms for a purchase. */
export function newTerms(rule: Rule, units: number, now: number): Pick<Pass, "expiresAt" | "usesLeft" | "usesTotal"> {
  if (rule.mode === "time" && rule.unitMinutes) {
    return { expiresAt: now + units * rule.unitMinutes * 60_000, usesLeft: null, usesTotal: null }
  }
  if (rule.mode === "uses" && rule.usesPerUnit) {
    const n = units * rule.usesPerUnit
    return { expiresAt: null, usesLeft: n, usesTotal: n }
  }
  return { expiresAt: null, usesLeft: null, usesTotal: null }
}
