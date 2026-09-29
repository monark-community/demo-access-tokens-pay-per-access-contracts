# GatePay

**Sell access by the hour, the use, or forever.** GatePay turns a token payment into a pass with rules: how long it lasts, how many times it opens. Doors, streams and files check the pass on-chain through a gateway, and lock again when it runs out.

This repository is the demo site: a Next.js app with a fully simulated wallet and testnet, in English and French. GatePay is an independent product incubated by [Monark](https://www.monark.io). Project documentation: https://www.monark.io/en/project/access-tokens-pay-per-access-contracts

> Demo · simulated data. Testnet demo · not financial advice · no real funds.

## What you can do in the demo

- **Passes** (`/app`): connect the demo wallet, browse six gates at Harbour Street Works and friends (a rehearsal room, a tool locker, a livestream, a video course, a report and a paid notice board), buy a pass, use it, renew it.
- **Gate pages** (`/app/gate/[id]`): the rule, the buy panel with pending / confirmed / failed / rejected states, your pass counting down, and the thing behind the gate: a door that unlocks through a webhook, a player, a course, a report, a notice board.
- **Console** (`/app/console`): the operator's view: revenue, passes sold, holders, pause and resume sales, and a rule builder to publish a new gate.
- **Gateway** (`/app/gateway`): check any pass code at the door and read the access tape.
- **Demo controls**: fast-forward the clock (+1 hour, +1 day) to watch passes expire, fail the next transaction, top up test tokens, reset the demo.

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
| `types.ts` | Gates, rules, passes, access-log events, wallet and settings |
| `seed.ts` | Deterministic seed (seeded PRNG): gates, other holders' passes, the visitor's passes, the recent tape |
| `store.ts` | External store persisted to `localStorage` (every access in try/catch), the demo clock, the wallet-prompt promise |
| `chain.ts` | Simulated network: `submit()` (hash now, inclusion after 1.6–2.6 s, optional failure) and `read()` |
| `rules.ts` | Pure pass logic: state, remaining share, verification, renewal maths |
| `ops.ts` | State transitions: connect, purchase/renew, gateway check (consumes a use), publish, pause, expiry sweep, demo controls |
| `use-tx.ts` | Hook that walks a transaction: signing → rejected / pending → confirmed / failed |

A real build would replace `chain.ts` with contract writes and reads (`PassPurchased`, `PassUsed`, `accessOf`) and the gateway check with a server that verifies the pass before calling the device webhook. See `/how-it-works` for the shapes.

## Project structure

```
src/
  app/[locale]/          routes: home, app (passes, gate, console, gateway), how-it-works, credits, pricing (unlinked), 404
  components/site/       header, footer, logo, locale switch, theme
  components/pass/       pass stub, plate, dots, gateway tape (the signature pieces)
  components/demo/       demo views, wallet prompt, buy panel, access panels, demo controls
  components/ui/         shadcn/ui + Monark UI registry components (re-themed)
  i18n/                  locale config and EN/FR dictionaries
  lib/demo/              the simulated chain and data layer
docs/
  site-plan.md           the plan the site was built from, kept in sync
  assets.md              photo sources and credits
  screenshots/           Playwright screenshots
```

Stack: Next.js (App Router), TypeScript strict, Tailwind CSS v4, shadcn/ui on the [Monark UI registry](https://ui.monark.io) (`wallet`, `connect-wallet`, `token-amount`, `tx-status`, `network-badge`), lucide-react, next-themes, sonner.

## Deploy to Vercel

Import the repository in Vercel and deploy with the framework defaults (Next.js, pnpm detected from `pnpm-lock.yaml`, Node 22 from `engines`). No configuration or environment variables are required; every page prerenders, and gates published inside the demo render on demand.
