/**
 * Plausible identifiers for the simulated chain. Math.random only: this runs
 * in the browser, including over plain-http LAN previews where crypto.randomUUID
 * is unavailable.
 */

const HEX = "0123456789abcdef"
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"

export type Rng = () => number

/** Small seeded PRNG so the seeded demo looks the same on every reset. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick(chars: string, n: number, rng: Rng): string {
  let out = ""
  for (let i = 0; i < n; i++) out += chars[Math.floor(rng() * chars.length)]
  return out
}

/** EIP-55-looking mixed-case address (visual only, not a real checksum). */
export function randomAddress(rng: Rng = Math.random): string {
  let out = "0x"
  for (let i = 0; i < 40; i++) {
    const c = HEX[Math.floor(rng() * 16)] ?? "0"
    out += /[a-f]/.test(c) && rng() > 0.5 ? c.toUpperCase() : c
  }
  return out
}

export function randomHash(rng: Rng = Math.random): string {
  return `0x${pick(HEX, 64, rng)}`
}

/** Human key code printed on the stub: GP-4K7Q-2M. */
export function randomKeyCode(rng: Rng = Math.random): string {
  return `GP-${pick(CODE_ALPHABET, 4, rng)}-${pick(CODE_ALPHABET, 2, rng)}`
}

export function randomId(prefix: string, rng: Rng = Math.random): string {
  return `${prefix}-${pick("abcdefghijkmnpqrstuvwxyz23456789", 8, rng)}`
}

/** Normalise what someone types at the door: trims, uppercases, restores dashes. */
export function normaliseCode(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "")
  const body = raw.startsWith("GP") ? raw.slice(2) : raw
  if (body.length !== 6) return input.trim().toUpperCase()
  return `GP-${body.slice(0, 4)}-${body.slice(4)}`
}

/**
 * The 6-digit PIN a physical gate's keypad accepts for a key, valid while the
 * key is. Derived from the code and the gate, the way an offline keypad
 * computes time-bound PINs without a network (illustrative, not a real scheme).
 */
export function gatePin(code: string, gateId: string): string {
  let h = 2166136261
  for (const ch of `${gateId}:${code}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return String((h >>> 0) % 1_000_000).padStart(6, "0")
}

/** Simulated block height: one block every 12 s. */
export function blockAt(time: number): number {
  return 6_400_000 + (Math.floor(time / 12_000) % 1_000_000)
}
