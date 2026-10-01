/**
 * GatePay demo domain. Everything the UI needs goes through these types, so
 * the simulated chain in this folder could be swapped for wagmi/viem calls
 * against real contracts without touching components.
 */

export type TokenSymbol = "tUSDC" | "tDAI" | "tETH"

/** What sits behind the gate. The kind decides the gateway action. */
export type GateKind = "room" | "locker" | "stream" | "video" | "document" | "board"

/** time: each unit buys a duration · uses: each unit buys N uses · forever: one payment, no end. */
export type AccessMode = "time" | "uses" | "forever"

export interface Rule {
  mode: AccessMode
  /** Price of one unit, in whole tokens. */
  price: number
  token: TokenSymbol
  /** time mode: minutes bought by one unit. */
  unitMinutes?: number
  /** uses mode: uses bought by one unit. */
  usesPerUnit?: number
  /** Most units one purchase may buy (1 for forever). */
  maxUnits: number
}

export type GateAction = "unlock" | "play" | "reveal" | "broadcast"

export interface Gate {
  id: string
  kind: GateKind
  title: string
  /** Short place or channel line under the title. */
  place: string
  description: string
  ownerName: string
  ownerAddress: string
  /** The pay-per-access contract that records passes for this gate. */
  contract: string
  rule: Rule
  /** Device gates call this webhook after a successful check. */
  webhookUrl?: string
  /** Key into the photo table (see lib/photos.ts); code-drawn cover when absent. */
  photo?: string
  status: "live" | "paused"
  createdAt: number
  /** Lifetime counters (seeded with plausible history). */
  sold: number
  revenue: number
}

export interface Pass {
  /** On-chain token id. */
  tokenId: number
  /** Human code printed on the stub and typed at the door, e.g. GP-4K7Q-2M. */
  code: string
  gateId: string
  holder: string
  units: number
  paid: number
  token: TokenSymbol
  purchasedAt: number
  /** time mode: when access ends. null for uses/forever. */
  expiresAt: number | null
  /** uses mode: uses remaining and bought. null otherwise. */
  usesLeft: number | null
  usesTotal: number | null
  txHash: string
}

export type PassState = "active" | "low" | "expired" | "spent" | "forever"

export type DenyReason = "expired" | "spent" | "wrongGate" | "unknown" | "paused"

/** One line of the gateway tape. Text is rendered from the dictionary. */
export type LogEvent =
  | { id: string; at: number; gateId: string; type: "payment"; code: string; holder: string; amount: number; token: TokenSymbol; units: number; block: number }
  | { id: string; at: number; gateId: string; type: "renewal"; code: string; holder: string; amount: number; token: TokenSymbol; units: number; block: number }
  | { id: string; at: number; gateId: string; type: "check"; code: string; holder: string; block: number }
  | { id: string; at: number; gateId: string; type: "action"; code: string; action: GateAction; hook?: string; httpStatus?: number; ms: number }
  | { id: string; at: number; gateId: string; type: "denied"; code: string; reason: DenyReason }
  | { id: string; at: number; gateId: string; type: "expired"; code: string; holder: string }
  | { id: string; at: number; gateId: string; type: "published"; block: number }
  | { id: string; at: number; gateId: string; type: "paused" | "resumed"; block: number }

export type LogEventType = LogEvent["type"]

export interface BoardPost {
  id: string
  at: number
  author: string
  text: string
  code: string
}

export interface WalletState {
  status: "disconnected" | "connecting" | "connected"
  address: string
  balances: Record<TokenSymbol, number>
}

export interface DemoSettings {
  /** Make the next transaction fail on the simulated network. */
  failNext: boolean
  /** Demo clock offset (fast-forward), in ms. */
  clockOffset: number
}

export interface DemoState {
  version: 1
  locale: "en" | "fr"
  wallet: WalletState
  operator: { name: string; address: string }
  gates: Gate[]
  passes: Pass[]
  log: LogEvent[]
  board: BoardPost[]
  settings: DemoSettings
  nextTokenId: number
  /** Codes of passes whose expiry has already been written to the tape. */
  expiryLogged: string[]
}

/** What the wallet prompt shows before a signature. */
export interface TxSummary {
  signer: "visitor" | "operator"
  title: string
  lines: { label: string; value: string }[]
  /** Moves value: show the testnet disclaimer. */
  movesValue: boolean
}

export type TxPhase = "idle" | "signing" | "pending" | "confirmed" | "failed" | "rejected"

export interface TxResult {
  hash: string
  block: number
}
