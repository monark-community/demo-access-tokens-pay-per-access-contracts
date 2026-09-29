"use client"

import { handshake, read } from "./chain"
import { blockAt, normaliseCode, randomAddress, randomPassCode } from "./ids"
import { KIND_ACTION, KIND_HOOK, extendPass, newTerms, verify } from "./rules"
import { demoNow, getDemo, requestPrompt, update } from "./store"
import { NETWORK_FEE_ETH, roundToken } from "./tokens"
import type { DenyReason, DemoState, Gate, LogEvent, Pass, Rule, TokenSymbol, TxResult } from "./types"

/**
 * State transitions of the demo. Each one is what a confirmed transaction or
 * contract read would do on a real chain; the UI calls them through useTx().
 */

let evSeq = 0
const evId = () => `ev-${Date.now().toString(36)}-${(evSeq++).toString(36)}`

function withLog(s: DemoState, ...events: LogEvent[]): DemoState {
  return { ...s, log: [...events, ...s.log].slice(0, 400) }
}

function payFee(balances: DemoState["wallet"]["balances"]) {
  return { ...balances, tETH: roundToken(Math.max(0, balances.tETH - NETWORK_FEE_ETH), "tETH") }
}

/* Wallet ------------------------------------------------------------------ */

export async function connectWallet(): Promise<"connected" | "rejected"> {
  const ok = await requestPrompt("connect")
  if (!ok) return "rejected"
  update((s) => ({ ...s, wallet: { ...s.wallet, status: "connecting" } }))
  await handshake()
  update((s) => ({ ...s, wallet: { ...s.wallet, status: "connected" } }))
  return "connected"
}

export function disconnectWallet() {
  update((s) => ({ ...s, wallet: { ...s.wallet, status: "disconnected" } }))
}

export function topUp(token: TokenSymbol, amount: number) {
  update((s) => ({
    ...s,
    wallet: { ...s.wallet, balances: { ...s.wallet.balances, [token]: roundToken(s.wallet.balances[token] + amount, token) } },
  }))
}

/* Buying ------------------------------------------------------------------ */

/** Record a confirmed purchase (or renewal of `renewCode`). Returns the pass code. */
export function applyPurchase(gateId: string, units: number, tx: TxResult, renewCode?: string): string | null {
  const s = getDemo()
  const gate = s?.gates.find((g) => g.id === gateId)
  if (!s || !gate) return null
  const now = demoNow()
  const cost = roundToken(units * gate.rule.price, gate.rule.token)
  const holder = s.wallet.address
  let code = renewCode ?? ""

  update((st) => {
    let passes = st.passes
    let event: LogEvent
    const existing = renewCode ? st.passes.find((p) => p.code === renewCode) : undefined
    if (existing) {
      const terms = extendPass(existing, gate.rule, units, now)
      passes = st.passes.map((p) =>
        p.code === existing.code ? { ...p, ...terms, units: p.units + units, paid: roundToken(p.paid + cost, p.token) } : p
      )
      event = { id: evId(), at: now, gateId, type: "renewal", code: existing.code, holder, amount: cost, token: gate.rule.token, units, block: tx.block }
    } else {
      code = randomPassCode()
      const pass: Pass = {
        tokenId: st.nextTokenId,
        code,
        gateId,
        holder,
        units,
        paid: cost,
        token: gate.rule.token,
        purchasedAt: now,
        ...newTerms(gate.rule, units, now),
        txHash: tx.hash,
      }
      passes = [pass, ...st.passes]
      event = { id: evId(), at: now, gateId, type: "payment", code, holder, amount: cost, token: gate.rule.token, units, block: tx.block }
    }
    const balances = payFee({
      ...st.wallet.balances,
      [gate.rule.token]: roundToken(st.wallet.balances[gate.rule.token] - cost, gate.rule.token),
    })
    return withLog(
      {
        ...st,
        passes,
        nextTokenId: existing ? st.nextTokenId : st.nextTokenId + 1,
        wallet: { ...st.wallet, balances },
        expiryLogged: existing ? st.expiryLogged.filter((c) => c !== existing.code) : st.expiryLogged,
        gates: st.gates.map((g) => (g.id === gateId ? { ...g, sold: g.sold + 1, revenue: roundToken(g.revenue + cost, g.rule.token) } : g)),
      },
      event
    )
  })
  return code
}

/* Checking a pass at the gateway ----------------------------------------- */

export type CheckResult =
  | { ok: true; pass: Pass; block: number; ms: number }
  | { ok: false; reason: DenyReason; pass?: Pass; block: number }

/**
 * The gateway: read the pass on-chain, refuse with a reason, or record the use
 * and perform the gate's action. `consume` is false for a dry check at the door.
 */
export async function checkPass(gateId: string, rawCode: string, opts: { consume?: boolean } = {}): Promise<CheckResult> {
  const { block } = await read()
  const s = getDemo()
  const now = demoNow()
  const code = normaliseCode(rawCode)
  const gate = s?.gates.find((g) => g.id === gateId)
  const pass = s?.passes.find((p) => p.code === code)
  const verdict = verify(gate, pass, now)

  if (!verdict.ok || !gate) {
    const reason = verdict.ok ? "unknown" : verdict.reason
    update((st) => withLog(st, { id: evId(), at: now, gateId, type: "denied", code, reason }))
    return { ok: false, reason, pass: verdict.ok ? undefined : verdict.pass, block }
  }

  const consume = opts.consume ?? true
  const ms = 80 + Math.floor(Math.random() * 140)
  update((st) => {
    const passes =
      consume && verdict.pass.usesLeft !== null
        ? st.passes.map((p) => (p.code === code ? { ...p, usesLeft: Math.max(0, (p.usesLeft ?? 0) - 1) } : p))
        : st.passes
    const events: LogEvent[] = [
      { id: evId(), at: now, gateId, type: "check", code, holder: verdict.pass.holder, block },
    ]
    if (consume) {
      const hook = KIND_HOOK[gate.kind]
      events.unshift({
        id: evId(),
        at: now + 300,
        gateId,
        type: "action",
        code,
        action: KIND_ACTION[gate.kind],
        hook,
        httpStatus: hook ? 200 : undefined,
        ms,
      })
    }
    return withLog({ ...st, passes }, ...events)
  })
  const fresh = getDemo()?.passes.find((p) => p.code === code) ?? verdict.pass
  return { ok: true, pass: fresh, block, ms }
}

export function postToBoard(code: string, text: string) {
  const s = getDemo()
  if (!s) return
  update((st) => ({
    ...st,
    board: [{ id: evId(), at: demoNow(), author: "", text, code }, ...st.board].slice(0, 30),
  }))
}

/* Expiry sweep: write each expiry to the tape once ------------------------ */

export function sweepExpiries() {
  const s = getDemo()
  if (!s) return
  const now = demoNow()
  const due = s.passes.filter((p) => p.expiresAt !== null && p.expiresAt <= now && !s.expiryLogged.includes(p.code))
  if (!due.length) return
  update((st) =>
    withLog(
      { ...st, expiryLogged: [...st.expiryLogged, ...due.map((p) => p.code)] },
      ...due
        .sort((a, b) => (b.expiresAt ?? 0) - (a.expiresAt ?? 0))
        .map((p): LogEvent => ({ id: evId(), at: p.expiresAt ?? now, gateId: p.gateId, type: "expired", code: p.code, holder: p.holder }))
    )
  )
}

/* Operator ---------------------------------------------------------------- */

export interface GateDraft {
  kind: Gate["kind"]
  title: string
  place: string
  description: string
  rule: Rule
  webhookUrl?: string
}

function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 32) || "gate"
  )
}

export function applyPublish(draft: GateDraft, tx: TxResult): string {
  const s = getDemo()
  const now = demoNow()
  let id = slugify(draft.title)
  if (s?.gates.some((g) => g.id === id)) id = `${id}-${Math.floor(Math.random() * 900 + 100)}`
  update((st) => {
    const gate: Gate = {
      id,
      kind: draft.kind,
      title: draft.title.trim(),
      place: draft.place.trim(),
      description: draft.description.trim(),
      ownerName: st.operator.name,
      ownerAddress: st.operator.address,
      contract: randomAddress(),
      rule: draft.rule,
      webhookUrl: draft.webhookUrl,
      status: "live",
      createdAt: now,
      sold: 0,
      revenue: 0,
    }
    return withLog({ ...st, gates: [gate, ...st.gates] }, { id: evId(), at: now, gateId: id, type: "published", block: tx.block })
  })
  return id
}

export function applyPause(gateId: string, paused: boolean, tx: TxResult) {
  const now = demoNow()
  update((st) =>
    withLog(
      { ...st, gates: st.gates.map((g) => (g.id === gateId ? { ...g, status: paused ? "paused" : "live" } : g)) },
      { id: evId(), at: now, gateId, type: paused ? "paused" : "resumed", block: tx.block }
    )
  )
}

/* Demo controls ----------------------------------------------------------- */

export function fastForward(ms: number) {
  update((s) => ({ ...s, settings: { ...s.settings, clockOffset: s.settings.clockOffset + ms } }))
  sweepExpiries()
}

export function backToNow() {
  update((s) => ({ ...s, settings: { ...s.settings, clockOffset: 0 } }))
}

export function setFailNext(on: boolean) {
  update((s) => ({ ...s, settings: { ...s.settings, failNext: on } }))
}

export { blockAt }
