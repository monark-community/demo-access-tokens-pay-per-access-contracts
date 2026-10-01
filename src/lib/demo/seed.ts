import type { Dictionary } from "@/i18n/dictionaries/en"

import { blockAt, mulberry32, randomAddress, randomHash, randomKeyCode, type Rng } from "./ids"
import { KIND_ACTION, KIND_HOOK, newTerms } from "./rules"
import type { AccessKey, BoardPost, DemoState, Gate, LogEvent, Owner, Rule, TokenSymbol } from "./types"

export type SeedCopy = Dictionary["seed"]

export const VISITOR_ADDRESS = "0x5ae1C07b9D42f3E8a61B0c2De4F7a9b35C8dc3B9"
export const OPERATOR_ADDRESS = "0x7F3a9C21e5D8b04A6c1E92f7B3d58A0c4E6b21D7"
const CAMILLE_ADDRESS = "0x2c8E41b7A09d3F6e5B12c7D84a9E0f3B6d71C5a2"
const NOOR_ADDRESS = "0x9B04d6E2f81A3c75E0b9D24a6F1c83E57bA0d19F"
const PARKS_ADDRESS = "0x4D7e0A93c61F2b85E3d9C40a7B1f6E28d5A0c93E"

/** The operator seat in the console: Harbour Street Works. */
export const OPERATOR_ID = "hsw"

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

/** The key shown in the hero; seeded on another holder so the code is real in the demo. */
export const HERO_CODE = "GP-4K7Q-2M"

type OwnerId = keyof SeedCopy["owners"]

const OWNERS: Record<OwnerId, Omit<Owner, "id" | "name">> = {
  hsw: { kind: "org", address: OPERATOR_ADDRESS },
  parks: { kind: "org", address: PARKS_ADDRESS },
  camille: { kind: "person", avatar: "ownerCamille", address: CAMILLE_ADDRESS },
  noor: { kind: "person", avatar: "ownerNoor", address: NOOR_ADDRESS },
}

type SeedGate = Omit<Gate, "title" | "place" | "description" | "ownerAddress">

function gates(rng: Rng, now: number): SeedGate[] {
  const g = (
    id: keyof SeedCopy["gates"],
    kind: Gate["kind"],
    rule: Rule,
    extra: Partial<SeedGate> & { ownerId: OwnerId; photos: string[]; sold: number; revenue: number }
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
    // City courts and fields: Harbourview Parks & Recreation.
    g("riverside-court", "court", { mode: "uses", price: 15, token: "tUSDC", usesPerUnit: 10, maxUnits: 2 }, {
      ownerId: "parks",
      webhookUrl: "https://gates.harbourview-parks.example/riverside-2/unlock",
      photos: ["tennis", "tennisGate", "tennisPlay"],
      sold: 412,
      revenue: 6180,
    }),
    g("pine-cage", "court", { mode: "time", price: 3, token: "tUSDC", unitMinutes: 60, maxUnits: 3 }, {
      ownerId: "parks",
      webhookUrl: "https://gates.harbourview-parks.example/pine-st/unlock",
      photos: ["hoops", "hoopsFence", "hoopsPlay"],
      sold: 655,
      revenue: 2964,
    }),
    g("diamond-3", "court", { mode: "time", price: 20, token: "tUSDC", unitMinutes: 120, maxUnits: 3 }, {
      ownerId: "parks",
      webhookUrl: "https://gates.harbourview-parks.example/diamond-3/unlock",
      photos: ["diamond", "diamondDugout", "diamondPlay"],
      sold: 97,
      revenue: 2540,
    }),
    // Harbour Street Works: rooms, lockers, a stream and the lobby board.
    g("studio-b", "room", { mode: "time", price: 12, token: "tUSDC", unitMinutes: 60, maxUnits: 4 }, {
      ownerId: "hsw",
      webhookUrl: "https://hooks.harbourstreet.example/studio-b/unlock",
      photos: ["studio", "studio2", "studio3"],
      sold: 318,
      revenue: 7632,
    }),
    g("rooftop-session", "stream", { mode: "time", price: 4, token: "tUSDC", unitMinutes: 48 * 60, maxUnits: 1 }, {
      ownerId: "hsw",
      photos: ["stream", "stream2", "stream3"],
      sold: 212,
      revenue: 848,
    }),
    g("locker-14", "locker", { mode: "uses", price: 2, token: "tUSDC", usesPerUnit: 5, maxUnits: 3 }, {
      ownerId: "hsw",
      webhookUrl: "https://hooks.harbourstreet.example/lockers/14",
      photos: ["lockers", "lockers2", "lockers3"],
      sold: 146,
      revenue: 318,
    }),
    g("notice-board", "board", { mode: "uses", price: 3, token: "tUSDC", usesPerUnit: 1, maxUnits: 5 }, {
      ownerId: "hsw",
      photos: [],
      sold: 57,
      revenue: 204,
    }),
    // Independent sellers.
    g("kiln-course", "video", { mode: "time", price: 15, token: "tUSDC", unitMinutes: 30 * 24 * 60, maxUnits: 1 }, {
      ownerId: "camille",
      photos: ["pottery", "pottery2", "pottery3"],
      sold: 88,
      revenue: 1320,
    }),
    g("lowwater-report", "document", { mode: "forever", price: 9, token: "tDAI", maxUnits: 1 }, {
      ownerId: "noor",
      photos: [],
      sold: 41,
      revenue: 369,
    }),
  ]
}

interface KeyPlan {
  gateId: string
  holder: string
  units: number
  /** Minutes before now the key was bought. */
  boughtAgo: number
  usesLeft?: number
  code?: string
}

export function createSeed(copy: SeedCopy, locale: "en" | "fr", now = Date.now()): DemoState {
  const rng = mulberry32(20260929)
  const owners: Owner[] = (Object.keys(OWNERS) as OwnerId[]).map((id) => ({ id, name: copy.owners[id], ...OWNERS[id] }))
  const allGates: Gate[] = gates(rng, now).map((gate) => {
    const text = copy.gates[gate.id as keyof SeedCopy["gates"]]
    return {
      ...gate,
      ownerAddress: OWNERS[gate.ownerId as OwnerId].address,
      title: text.title,
      place: text.place,
      description: text.description,
    }
  })
  const byId = new Map(allGates.map((g) => [g.id, g]))

  const others = Array.from({ length: 16 }, () => randomAddress(rng))
  const o = (i: number) => others[i % others.length] ?? VISITOR_ADDRESS

  const plans: KeyPlan[] = [
    // The visitor holds one key of each mode, plus one that ran out:
    // metered (tennis, 3 of 10 entries left), timed (the stream), forever (the report).
    { gateId: "riverside-court", holder: VISITOR_ADDRESS, units: 1, boughtAgo: 12 * 24 * 60, usesLeft: 3 },
    { gateId: "rooftop-session", holder: VISITOR_ADDRESS, units: 1, boughtAgo: 17 * 60 },
    { gateId: "lowwater-report", holder: VISITOR_ADDRESS, units: 1, boughtAgo: 9 * 24 * 60 },
    { gateId: "kiln-course", holder: VISITOR_ADDRESS, units: 1, boughtAgo: 33 * 24 * 60 },
    // Other holders (for the console, the gateway and the tape).
    { gateId: "studio-b", holder: o(0), units: 2, boughtAgo: 23, code: HERO_CODE },
    { gateId: "studio-b", holder: o(1), units: 3, boughtAgo: 95 },
    { gateId: "studio-b", holder: o(2), units: 1, boughtAgo: 5 * 60 },
    { gateId: "studio-b", holder: o(3), units: 2, boughtAgo: 26 * 60 },
    { gateId: "studio-b", holder: o(4), units: 4, boughtAgo: 2 * 24 * 60 },
    { gateId: "locker-14", holder: o(6), units: 1, boughtAgo: 50, usesLeft: 4 },
    { gateId: "locker-14", holder: o(7), units: 2, boughtAgo: 9 * 60, usesLeft: 7 },
    { gateId: "locker-14", holder: o(8), units: 1, boughtAgo: 4 * 24 * 60, usesLeft: 0 },
    { gateId: "rooftop-session", holder: o(9), units: 1, boughtAgo: 3 * 60 },
    { gateId: "rooftop-session", holder: o(10), units: 1, boughtAgo: 20 * 60 },
    { gateId: "notice-board", holder: o(12), units: 1, boughtAgo: 6 * 60, usesLeft: 0 },
    { gateId: "notice-board", holder: o(13), units: 2, boughtAgo: 30 * 60, usesLeft: 0 },
    { gateId: "kiln-course", holder: o(1), units: 1, boughtAgo: 6 * 24 * 60 },
    { gateId: "lowwater-report", holder: o(4), units: 1, boughtAgo: 9 * 24 * 60 },
    { gateId: "riverside-court", holder: o(14), units: 1, boughtAgo: 40, usesLeft: 9 },
    { gateId: "riverside-court", holder: o(5), units: 2, boughtAgo: 6 * 24 * 60, usesLeft: 14 },
    { gateId: "pine-cage", holder: o(11), units: 1, boughtAgo: 25 },
    { gateId: "pine-cage", holder: o(15), units: 2, boughtAgo: 4 * 60 },
    { gateId: "diamond-3", holder: o(3), units: 1, boughtAgo: 70 },
  ]

  let tokenId = 1017
  const keys: AccessKey[] = plans.map((p) => {
    const gate = byId.get(p.gateId)!
    const at = now - p.boughtAgo * MIN
    const terms = newTerms(gate.rule, p.units, at)
    return {
      tokenId: tokenId++,
      code: p.code ?? randomKeyCode(rng),
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
  for (const k of keys) {
    const gate = byId.get(k.gateId)!
    if (now - k.purchasedAt > 30 * HOUR) continue
    push({
      id: id(),
      at: k.purchasedAt,
      gateId: k.gateId,
      type: "payment",
      code: k.code,
      holder: k.holder,
      amount: k.paid,
      token: k.token as TokenSymbol,
      units: k.units,
      block: blockAt(k.purchasedAt),
    })
    const checkAt = k.purchasedAt + 2 * MIN
    if (checkAt < now) {
      push({ id: id(), at: checkAt, gateId: k.gateId, type: "check", code: k.code, holder: k.holder, block: blockAt(checkAt) })
      const hook = KIND_HOOK[gate.kind]
      push({
        id: id(),
        at: checkAt + 400,
        gateId: k.gateId,
        type: "action",
        code: k.code,
        action: KIND_ACTION[gate.kind],
        hook,
        httpStatus: hook ? 200 : undefined,
        ms: 90 + Math.floor(rng() * 120),
      })
    }
  }
  // A refused check: someone tried an expired studio key this morning.
  const expiredStudio = keys.find((k) => k.gateId === "studio-b" && k.expiresAt !== null && k.expiresAt < now - HOUR)
  if (expiredStudio) {
    push({ id: id(), at: now - 3 * HOUR - 12 * MIN, gateId: "studio-b", type: "denied", code: expiredStudio.code, reason: "expired" })
  }
  const recentExpiry = keys.find((k) => k.gateId === "studio-b" && k.expiresAt !== null && k.expiresAt < now && now - k.expiresAt < 24 * HOUR)
  if (recentExpiry && recentExpiry.expiresAt) {
    push({ id: id(), at: recentExpiry.expiresAt, gateId: "studio-b", type: "expired", code: recentExpiry.code, holder: recentExpiry.holder })
  }
  log.sort((a, b) => b.at - a.at)

  const board: BoardPost[] = copy.board.map((post, i) => ({
    id: `post-${i}`,
    at: now - (i * 5 + 2) * HOUR,
    author: post.author,
    text: post.text,
    code: keys.find((k) => k.gateId === "notice-board")?.code ?? randomKeyCode(rng),
  }))

  return {
    version: 2,
    locale,
    wallet: {
      status: "disconnected",
      address: VISITOR_ADDRESS,
      balances: { tUSDC: 40, tDAI: 20, tETH: 0.02 },
    },
    operator: { name: copy.owners.hsw, address: OPERATOR_ADDRESS },
    owners,
    gates: allGates,
    keys,
    log,
    board,
    settings: { failNext: false, clockOffset: 0 },
    nextTokenId: tokenId,
    // Expiries before the demo started are history, not news.
    expiryLogged: keys.filter((k) => k.expiresAt !== null && k.expiresAt <= now).map((k) => k.code),
  }
}
