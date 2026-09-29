import type { TokenSymbol } from "./types"

/** Test tokens and fixed reference prices (no price feed in the demo). */
export const TOKENS: Record<TokenSymbol, { decimals: number; usd: number; display: number }> = {
  tUSDC: { decimals: 6, usd: 1, display: 2 },
  tDAI: { decimals: 18, usd: 1, display: 2 },
  tETH: { decimals: 18, usd: 3200, display: 5 },
}

export const TOKEN_LIST: TokenSymbol[] = ["tUSDC", "tDAI", "tETH"]

/** Network fee per transaction, paid in tETH by the signer. */
export const NETWORK_FEE_ETH = 0.00004

/** Whole-token number to base units, for the TokenAmount component. */
export function toBaseUnits(amount: number, token: TokenSymbol): bigint {
  const { decimals } = TOKENS[token]
  const fixed = amount.toFixed(Math.min(decimals, 8))
  const [whole = "0", frac = ""] = fixed.split(".")
  const negative = whole.startsWith("-")
  const digits = (negative ? whole.slice(1) : whole) + frac.padEnd(decimals, "0").slice(0, decimals)
  const value = BigInt(digits)
  return negative ? -value : value
}

/** Round to the token's smallest sensible step to avoid float dust. */
export function roundToken(amount: number, token: TokenSymbol): number {
  const step = token === "tETH" ? 1e8 : 1e6
  return Math.round(amount * step) / step
}
