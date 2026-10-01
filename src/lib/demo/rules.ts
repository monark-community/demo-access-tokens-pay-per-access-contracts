import type { AccessKey, DenyReason, Gate, GateAction, GateKind, KeyState, Owner, Rule, Surface } from "./types"

export const KIND_ACTION: Record<GateKind, GateAction> = {
  room: "unlock",
  locker: "unlock",
  court: "unlock",
  stream: "play",
  video: "play",
  document: "reveal",
  board: "broadcast",
}

export const KIND_HOOK: Partial<Record<GateKind, string>> = {
  room: "door.unlock",
  locker: "locker.open",
  court: "gate.unlock",
}

export const KINDS: GateKind[] = ["court", "room", "locker", "stream", "video", "document", "board"]

const PHYSICAL: GateKind[] = ["room", "locker", "court"]

/** Physical gates open a lock on site; the rest reveal something on screen. */
export function surfaceOf(kind: GateKind): Surface {
  return PHYSICAL.includes(kind) ? "physical" : "digital"
}

/** Share of the key left, 0..1 (1 for forever). */
export function remainingShare(key: AccessKey, now: number): number {
  if (key.expiresAt !== null) {
    const total = key.expiresAt - key.purchasedAt
    if (total <= 0) return 0
    return Math.max(0, Math.min(1, (key.expiresAt - now) / total))
  }
  if (key.usesLeft !== null && key.usesTotal) return key.usesLeft / key.usesTotal
  return 1
}

export function keyState(key: AccessKey, now: number): KeyState {
  if (key.expiresAt !== null) {
    if (now >= key.expiresAt) return "expired"
    return remainingShare(key, now) <= 0.15 ? "low" : "active"
  }
  if (key.usesLeft !== null) {
    if (key.usesLeft <= 0) return "spent"
    return key.usesLeft === 1 ? "low" : "active"
  }
  return "forever"
}

export function isUsable(key: AccessKey, now: number): boolean {
  const s = keyState(key, now)
  return s === "active" || s === "low" || s === "forever"
}

/** What the gateway decides for a code at a gate. Pure: no state changes. */
export function verify(
  gate: Gate | undefined,
  key: AccessKey | undefined,
  now: number
): { ok: true; key: AccessKey } | { ok: false; reason: DenyReason; key?: AccessKey } {
  if (!gate || !key) return { ok: false, reason: "unknown" }
  if (key.gateId !== gate.id) return { ok: false, reason: "wrongGate", key }
  const s = keyState(key, now)
  if (s === "expired") return { ok: false, reason: "expired", key }
  if (s === "spent") return { ok: false, reason: "spent", key }
  return { ok: true, key }
}

/** The holder's most useful key for a gate: usable first, then the latest. */
export function bestKey(keys: AccessKey[], gateId: string, holder: string, now: number): AccessKey | undefined {
  const mine = keys.filter((p) => p.gateId === gateId && p.holder.toLowerCase() === holder.toLowerCase())
  const usable = mine.filter((p) => isUsable(p, now))
  const pool = usable.length ? usable : mine
  return pool.sort((a, b) => b.purchasedAt - a.purchasedAt)[0]
}

/** New end date or uses after buying `units` more on top of an existing key. */
export function extendKey(key: AccessKey, rule: Rule, units: number, now: number): Pick<AccessKey, "expiresAt" | "usesLeft" | "usesTotal"> {
  if (rule.mode === "time" && rule.unitMinutes) {
    const from = Math.max(now, key.expiresAt ?? now)
    return { expiresAt: from + units * rule.unitMinutes * 60_000, usesLeft: null, usesTotal: null }
  }
  if (rule.mode === "uses" && rule.usesPerUnit) {
    const add = units * rule.usesPerUnit
    const left = Math.max(0, key.usesLeft ?? 0)
    return { expiresAt: null, usesLeft: left + add, usesTotal: left + add }
  }
  return { expiresAt: null, usesLeft: null, usesTotal: null }
}

/** Fresh key terms for a purchase. */
export function newTerms(rule: Rule, units: number, now: number): Pick<AccessKey, "expiresAt" | "usesLeft" | "usesTotal"> {
  if (rule.mode === "time" && rule.unitMinutes) {
    return { expiresAt: now + units * rule.unitMinutes * 60_000, usesLeft: null, usesTotal: null }
  }
  if (rule.mode === "uses" && rule.usesPerUnit) {
    const n = units * rule.usesPerUnit
    return { expiresAt: null, usesLeft: n, usesTotal: n }
  }
  return { expiresAt: null, usesLeft: null, usesTotal: null }
}

/** The owner a gate pays out to; a placeholder for gates whose owner was removed. */
export function ownerOf(owners: Owner[], gate: Gate): Owner {
  return owners.find((o) => o.id === gate.ownerId) ?? { id: gate.ownerId, name: gate.ownerAddress, kind: "org", address: gate.ownerAddress }
}
