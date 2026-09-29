import type { Dictionary } from "@/i18n/dictionaries/en"

import { blockAt, mulberry32, randomAddress, randomHash, randomPassCode, type Rng } from "./ids"
import { newTerms } from "./rules"
import type { BoardPost, DemoState, Gate, LogEvent, Pass, Rule, TokenSymbol } from "./types"

export type SeedCopy = Dictionary["seed"]

export const VISITOR_ADDRESS = "0x5ae1C07b9D42f3E8a61B0c2De4F7a9b35C8dc3B9"
export const OPERATOR_ADDRESS = "0x7F3a9C21e5D8b04A6c1E92f7B3d58A0c4E6b21D7"
const ATELIER_ADDRESS = "0x2c8E41b7A09d3F6e5B12c7D84a9E0f3B6d71C5a2"
const LOWWATER_ADDRESS = "0x9B04d6E2f81A3c75E0b9D24a6F1c83E57bA0d19F"

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

/** The pass shown in the hero; seeded on another holder so the code is real in the demo. */
export const HERO_CODE = "GP-4K7Q-2M"

type SeedGate = Omit<Gate, "title" | "place" | "description" | "ownerName"> & { owner: keyof SeedCopy["owners"] }

function gates(rng: Rng, now: number): SeedGate[] {
  const g = (
    id: keyof SeedCopy["gates"],
    kind: Gate["kind"],
    rule: Rule,
    extra: Partial<SeedGate> & { owner: SeedGate["owner"]; ownerAddress: string; sold: number; revenue: number }
  ): SeedGate => ({
    id,
    kind,
    rule,
    contract: randomAddress(rng),
    status: "live",
    createdAt: now - 120 * DAY,
    ...extra,
  })
  return [
    g("studio-b", "room", { mode: "time", price: 12, token: "tUSDC", unitMinutes: 60, maxUnits: 4 }, {
      owner: "hsw",
      ownerAddress: OPERATOR_ADDRESS,
      webhookUrl: "https://hooks.harbourstreet.works/studio-b/unlock",
      photo: "studio",
      sold: 318,
      revenue: 7632,
    }),
    g("rooftop-session", "stream", { mode: "time", price: 4, token: "tUSDC", unitMinutes: 48 * 60, maxUnits: 1 }, {
      owner: "hsw",
      ownerAddress: OPERATOR_ADDRESS,
      photo: "stream",
      sold: 212,
      revenue: 848,
    }),
    g("kiln-course", "video", { mode: "time", price: 15, token: "tUSDC", unitMinutes: 30 * 24 * 60, maxUnits: 1 }, {
      owner: "atelier",
      ownerAddress: ATELIER_ADDRESS,
      photo: "pottery",
      sold: 88,
      revenue: 1320,
    }),
    g("locker-14", "locker", { mode: "uses", price: 2, token: "tUSDC", usesPerUnit: 5, maxUnits: 3 }, {
      owner: "hsw",
      ownerAddress: OPERATOR_ADDRESS,
      webhookUrl: "https://hooks.harbourstreet.works/lockers/14",
      photo: "lockers",
      sold: 146,
      revenue: 318,
    }),
    g("lowwater-report", "document", { mode: "forever", price: 9, token: "tDAI", maxUnits: 1 }, {
      owner: "lowwater",
      ownerAddress: LOWWATER_ADDRESS,
      sold: 41,
      revenue: 369,
    }),
    g("notice-board", "board", { mode: "uses", price: 3, token: "tUSDC", usesPerUnit: 1, maxUnits: 5 }, {
      owner: "hsw",
      ownerAddress: OPERATOR_ADDRESS,
      sold: 57,
      revenue: 204,
    }),
  ]
}

interface PassPlan {
  gateId: string
  holder: string
  units: number
  /** Minutes before now the pass was bought. */
  boughtAgo: number
  usesLeft?: number
  code?: string
}

export function createSeed(copy: SeedCopy, locale: "en" | "fr", now = Date.now()): DemoState {
  const rng = mulberry32(20260929)
  const base = gates(rng, now)
  const allGates: Gate[] = base.map(({ owner, ...gate }) => ({
    ...gate,
    ownerName: copy.owners[owner],
    title: copy.gates[gate.id as keyof SeedCopy["gates"]].title,
    place: copy.gates[gate.id as keyof SeedCopy["gates"]].place,
    description: copy.gates[gate.id as keyof SeedCopy["gates"]].description,
  }))
  const byId = new Map(allGates.map((g) => [g.id, g]))

  const others = Array.from({ length: 14 }, () => randomAddress(rng))
  const o = (i: number) => others[i % others.length] ?? VISITOR_ADDRESS

  const plans: PassPlan[] = [
    // The visitor: one live stream pass, a half-used locker pass, an expired course.
    { gateId: "rooftop-session", holder: VISITOR_ADDRESS, units: 1, boughtAgo: 17 * 60 },
    { gateId: "locker-14", holder: VISITOR_ADDRESS, units: 1, boughtAgo: 3 * 24 * 60, usesLeft: 2 },
    { gateId: "kiln-course", holder: VISITOR_ADDRESS, units: 1, boughtAgo: 33 * 24 * 60 },
    // Other holders at Harbour Street Works (for the console and the gateway).
    { gateId: "studio-b", holder: o(0), units: 2, boughtAgo: 23, code: HERO_CODE },
    { gateId: "studio-b", holder: o(1), units: 3, boughtAgo: 95 },
    { gateId: "studio-b", holder: o(2), units: 1, boughtAgo: 5 * 60 },
    { gateId: "studio-b", holder: o(3), units: 2, boughtAgo: 26 * 60 },
    { gateId: "studio-b", holder: o(4), units: 4, boughtAgo: 2 * 24 * 60 },
    { gateId: "studio-b", holder: o(5), units: 1, boughtAgo: 3 * 24 * 60 },
    { gateId: "locker-14", holder: o(6), units: 1, boughtAgo: 50, usesLeft: 4 },
    { gateId: "locker-14", holder: o(7), units: 2, boughtAgo: 9 * 60, usesLeft: 7 },
    { gateId: "locker-14", holder: o(8), units: 1, boughtAgo: 4 * 24 * 60, usesLeft: 0 },
    { gateId: "rooftop-session", holder: o(9), units: 1, boughtAgo: 3 * 60 },
    { gateId: "rooftop-session", holder: o(10), units: 1, boughtAgo: 20 * 60 },
    { gateId: "rooftop-session", holder: o(11), units: 1, boughtAgo: 60 * 60 },
    { gateId: "notice-board", holder: o(12), units: 1, boughtAgo: 6 * 60, usesLeft: 0 },
    { gateId: "notice-board", holder: o(13), units: 2, boughtAgo: 30 * 60, usesLeft: 0 },
    { gateId: "kiln-course", holder: o(1), units: 1, boughtAgo: 6 * 24 * 60 },
    { gateId: "lowwater-report", holder: o(4), units: 1, boughtAgo: 9 * 24 * 60 },
  ]

  let tokenId = 1017
  const passes: Pass[] = plans.map((p) => {
    const gate = byId.get(p.gateId)!
    const at = now - p.boughtAgo * MIN
    const terms = newTerms(gate.rule, p.units, at)
    return {
      tokenId: tokenId++,
      code: p.code ?? randomPassCode(rng),
      gateId: p.gateId,
      holder: p.holder,
      units: p.units,
      paid: p.units * gate.rule.price,
      token: gate.rule.token,
      purchasedAt: at,
      ...terms,
      usesLeft: p.usesLeft ?? terms.usesLeft,
      txHash: randomHash(rng),
    }
  })

  // The access tape: the last few hours, newest first.
  const log: LogEvent[] = []
  let n = 0
  const id = () => `ev-${n++}`
  const push = (e: LogEvent) => log.push(e)
  for (const p of passes) {
    const gate = byId.get(p.gateId)!
    if (now - p.purchasedAt > 30 * HOUR) continue
    push({
      id: id(),
      at: p.purchasedAt,
      gateId: p.gateId,
      type: "payment",
      code: p.code,
      holder: p.holder,
      amount: p.paid,
      token: p.token as TokenSymbol,
      units: p.units,
      block: blockAt(p.purchasedAt),
    })
    const checkAt = p.purchasedAt + 2 * MIN
    if (checkAt < now) {
      push({ id: id(), at: checkAt, gateId: p.gateId, type: "check", code: p.code, holder: p.holder, block: blockAt(checkAt) })
      const action = gate.kind === "room" || gate.kind === "locker" ? "unlock" : gate.kind === "board" ? "broadcast" : gate.kind === "document" ? "reveal" : "play"
      push({
        id: id(),
        at: checkAt + 400,
        gateId: p.gateId,
        type: "action",
        code: p.code,
        action,
        hook: gate.kind === "room" ? "door.unlock" : gate.kind === "locker" ? "locker.open" : undefined,
        httpStatus: gate.kind === "room" || gate.kind === "locker" ? 200 : undefined,
        ms: 90 + Math.floor(rng() * 120),
      })
    }
  }
  // A refused check: someone tried an expired studio pass this morning.
  const expiredStudio = passes.find((p) => p.gateId === "studio-b" && p.expiresAt !== null && p.expiresAt < now - HOUR)
  if (expiredStudio) {
    push({ id: id(), at: now - 3 * HOUR - 12 * MIN, gateId: "studio-b", type: "denied", code: expiredStudio.code, reason: "expired" })
  }
  const recentExpiry = passes.find((p) => p.gateId === "studio-b" && p.expiresAt !== null && p.expiresAt < now && now - p.expiresAt < 24 * HOUR)
  if (recentExpiry && recentExpiry.expiresAt) {
    push({ id: id(), at: recentExpiry.expiresAt, gateId: "studio-b", type: "expired", code: recentExpiry.code, holder: recentExpiry.holder })
  }
  log.sort((a, b) => b.at - a.at)

  const board: BoardPost[] = copy.board.map((post, i) => ({
    id: `post-${i}`,
    at: now - (i * 5 + 2) * HOUR,
    author: post.author,
    text: post.text,
    code: passes.find((p) => p.gateId === "notice-board")?.code ?? randomPassCode(rng),
  }))

  return {
    version: 1,
    locale,
    wallet: {
      status: "disconnected",
      address: VISITOR_ADDRESS,
      balances: { tUSDC: 40, tDAI: 20, tETH: 0.02 },
    },
    operator: { name: copy.owners.hsw, address: OPERATOR_ADDRESS },
    gates: allGates,
    passes,
    log,
    board,
    settings: { failNext: false, clockOffset: 0 },
    nextTokenId: tokenId,
    // Expiries before the demo started are history, not news.
    expiryLogged: passes.filter((p) => p.expiresAt !== null && p.expiresAt <= now).map((p) => p.code),
  }
}
