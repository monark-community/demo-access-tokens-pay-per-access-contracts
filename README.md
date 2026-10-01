# GatePay

**Pay once. Unlock anything.** GatePay sells digital keys: timed, metered, or yours forever. One key opens a court gate, a room or a locker (the gateway checks it on-chain, then opens the lock with a keypad PIN or an NFC tap), or unlocks a stream, a course or a file in the browser. Keys lock again on their own when they run out.

This repository is the demo site: a Next.js app with a fully simulated wallet and testnet, in English and French. GatePay is an independent product incubated by [Monark](https://www.monark.io). Project documentation: https://www.monark.io/en/project/access-tokens-pay-per-access-contracts

> Demo · simulated data. Testnet demo · not financial advice · no real funds.

## What you can do in the demo

- **Keys** (`/app`): connect the demo wallet, see your keys (one of each kind) and browse nine gates from four owners: city courts and fields (tennis, a basketball cage, a baseball diamond), a rehearsal room, a tool locker, a livestream, a video course, a report and a paid notice board. Filter by physical or digital, and by kind of key.
- **Gate pages** (`/app/gate/[id]`): a photo carousel, the owner you pay, and one **Unlock** button that pays if needed, mints the key, slides it in, checks it on-chain and opens: a keypad PIN and a swinging gate for physical gates, content coming into focus for digital ones. Pending / confirmed / failed / rejected states stay inline.
- **Console** (`/app/console`): the owner's view: revenue, keys sold, holders, pause and resume sales, and a rule builder to publish a new gate.
- **Gateway** (`/app/gateway`): check any key code at the gate and read the access tape.
- **Demo controls**: fast-forward the clock (+1 hour, +1 day) to watch keys expire, fail the next transaction, top up test tokens, reset the demo.

## Run it locally

Requires Node 22 and pnpm 10.

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm build && pnpm start
```

No environment variables are needed. `NEXT_PUBLIC_SITE_URL` optionally sets the canonical host (default `https://gatepay.monark.io`).

Screenshots of every page and flow (390px and 1440px, light and dark, plus French):

```bash
pnpm build && pnpm start -p 3144   # in one terminal
pnpm screenshots                   # BASE_URL defaults to http://localhost:3144
```

## How the simulation works

Everything lives in `src/lib/demo/`, behind a small typed API, so it can be swapped for wagmi/viem without touching components:

| File | Role |
|-|-|
| `types.ts` | Gates (physical or digital), owners, rules, keys (`AccessKey`), access-log events, wallet and settings |
| `seed.ts` | Deterministic seed (seeded PRNG): owners, gates, other holders' keys, the visitor's keys, the recent tape |
| `store.ts` | External store persisted to `localStorage` (every access in try/catch), the demo clock, the wallet-prompt promise |
| `chain.ts` | Simulated network: `submit()` (hash now, inclusion after 1.6–2.6 s, optional failure) and `read()` |
| `rules.ts` | Pure key logic: state, remaining share, verification, renewal maths, physical/digital, owner lookup |
| `ops.ts` | State transitions: connect, purchase/renew, gateway check (spends an entry), publish, pause, expiry sweep, demo controls |
| `ids.ts` | Addresses, hashes, key codes and the keypad PIN a physical gate accepts for a key |
| `use-tx.ts` | Hook that walks a transaction: signing → rejected / pending → confirmed / failed |

The unlock itself is one state machine, `src/components/demo/use-unlock.ts` (pay → mint → key in → check → open or denied), shared by the Unlock button and the reveal behind the gate.

A real build would replace `chain.ts` with contract writes and reads (`KeyPurchased`, `KeyUsed`, `accessOf`) and the gateway check with a server that verifies the key before calling the lock's webhook. `/how-it-works` shows those shapes and an illustrative SDK call; the SDK and the hardware integrations are not part of this repository.

## Project structure

```
src/
  app/[locale]/          routes: home, app (keys, gate, console, gateway), how-it-works, credits, pricing (unlinked), 404
  components/site/       header, footer, logo, locale switch, theme
  components/key/        key card, meter, plate, access tape (the signature pieces)
  components/demo/       demo views, unlock panel and state machine, carousel, owner avatar, wallet prompt, reveal panels, demo controls
  components/ui/         shadcn/ui + Monark UI registry components (re-themed)
  i18n/                  locale config and EN/FR dictionaries
  lib/demo/              the simulated chain and data layer
docs/
  site-plan.md           the plan the site was built from, kept in sync
  assets.md              photo sources and credits
  screenshots/           Playwright screenshots (before-keys/ and before-simplification/ keep earlier versions)
```

Stack: Next.js (App Router), TypeScript strict, Tailwind CSS v4, shadcn/ui on the [Monark UI registry](https://ui.monark.io) (`wallet`, `connect-wallet`, `token-amount`, `tx-status`, `network-badge`), lucide-react, next-themes, sonner.

## Deploy to Vercel

Import the repository in Vercel and deploy with the framework defaults (Next.js, pnpm detected from `pnpm-lock.yaml`, Node 22 from `engines`). No configuration or environment variables are required; every page prerenders, and gates published inside the demo render on demand.
