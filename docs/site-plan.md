# GatePay site plan

GatePay is an independent product incubated by Monark (`monark-branded: false`). It has its own identity; Monark appears only as a "Built with Monark" footer credit. This plan is the source of truth for what ships and is kept in sync with the code. Decisions taken without the owner are marked **Decision**.

Sources read: the Lovable app on `main` (`src/`), https://gatepay.monark.io/, and the authoritative project documentation (the `access-tokens-pay-per-access-contracts` entry of the monark.io `website` repo, which is what https://www.monark.io/en/project/access-tokens-pay-per-access-contracts renders).

**Revision 2026-09-30, "digital keys".** The owner reviewed the first version: the brand felt scattered (three accent hues on a brass-ticket concept), the product is a secure access app so a mono, digital look fits better, the thing sold is a **key**, not a ticket, and the three access models, the physical and digital reach, city sports courts, hardware integrations, gate owners and an unlock-first gate page had to be obvious. This plan describes the revised site; `docs/screenshots/before-keys/` holds the version before it.

---

## 1. Product brief

**What the documentation says.** Smart contracts that grant time-based or one-time access to digital or physical things. A publisher defines the asset, the access rule, the price, the duration and the token. A buyer pays from a wallet; the payment records access on-chain; an access gateway verifies it and then reveals content or triggers an action (play a stream, open a file, unlock a smart lock, broadcast an alert). Access can be limited by time, frequency or usage volume, and expires on its own, so the buyer renews or buys again. Milestones: access portal, contract access logic, token payments, gateway and verification layer, admin dashboard, access logs and analytics, device and broadcast integrations.

**Target users.**

- **Primary: owners who sell access to something they already have.** A city parks department renting tennis courts, basketball cages and baseball diamonds; a rehearsal studio renting a room by the hour; a makerspace renting lockers per use; a band selling a livestream; a ceramicist selling a course; a researcher selling a report. Today they juggle a booking tool, a card processor, a padlock or door code they change by hand and a membership plugin.
- **Secondary: the people who pay.** They want to pay for exactly what they use (two hours of court, ten entries, one report) with no account and no subscription to cancel, and to open the thing right away.
- **Tertiary: developers and students** who wire the gateway to a lock, a player or a webhook. The documentation frames this as a student project that teaches contract permissions and event-driven programming.

**Core job to be done.** "When someone pays, let them in for exactly what they paid for, and lock again when it runs out, without me doing anything."

**Domain concepts** (used consistently across the site and the code):

| Concept | Meaning |
|-|-|
| Gate | Something sold behind a rule. **Physical** (court or field, room, locker: the gateway opens a lock on site) or **digital** (stream, video course, document, paid board post: it unlocks in the browser). Owned by one owner. |
| Owner | Who you pay at a gate: an organisation (monogram avatar) or a person (portrait). Shown on every gate as "You pay …". |
| Rule | How access is sold: a **timed key** (N hours or days per unit), a **metered key** (N entries per unit) or a **keep-forever key**. Plus price per unit, token, max units per purchase. |
| Key | The on-chain record a payment creates (`AccessKey` in code): holder, gate, start, expiry or entries left, token id and a short code (`GP-4K7Q-2M`). Drawn as an access card. |
| Unlock | Using a key: the gateway checks it on-chain, spends one entry for metered keys, then opens the lock (with a keypad PIN and an NFC tap) or reveals the content. |
| Gateway | The layer that checks keys and performs the action: `gate.unlock` / `door.unlock` / `locker.open` webhooks, play, reveal, board post. Every check is logged. |
| Access tape | The log of payments, checks, actions, denials and expiries, per gate. |

**What the Lovable version got wrong or left out.**

- It pitched "infrastructure for platforms" with a purple-blue gradient, glass cards and six generic industry tiles, but nothing on the page worked: "Unlock Access" did nothing, and the dashboard was API keys and "Coming soon" panels.
- It never showed the actual idea: **a payment turns into a key, the key opens something, and the key runs out.**
- Prices were in ETH (0.1 ETH for a course), which makes pay-per-access look expensive and volatile.
- Physical access (smart locks), central in the documentation, was a single tile.
- The pricing page was linked from the header and invented "cross-chain" fees.

## 2. Value proposition

> **For cities, venues and creators that sell access to courts, rooms, streams and files, GatePay turns a small token payment into a digital key (timed, metered or yours forever) that any lock, player or page checks on-chain, so they can charge per hour or per entry without accounts, padlocks to change, or card fees that make a $3 sale pointless.**

1. **You get paid for every hour and every entry, even the $3 ones.** No fixed card fee eating small sales.
2. **Nobody gets in on an expired key, and you never change a padlock code again.** The key carries its own expiry or entry count; the gateway checks it at the gate.
3. **Buyers pay once and walk in.** One button pays and unlocks; the key is in their wallet with a meter they can see.

## 3. Hero

- **Headline (5 words):** "Pay once. Unlock anything." FR: « Payez une fois. Ouvrez tout. »
- **Subheadline (18 words):** "Digital keys that open courts, rooms and lockers, or streams and files. Timed, metered, or yours forever." FR: « Des clés numériques qui ouvrent terrains, salles et casiers, ou diffusions et fichiers. À durée, à l'usage ou à vie. »
- **Primary CTA:** "Unlock a court" → `/{locale}/app/gate/riverside-court`. **Secondary:** "How a key works" → `/{locale}/how-it-works`.
- **Hero visual: the product itself**, drawn in code on a faint engineering grid. One metered key card (*Riverside court 2*, 3 of 10 entries) above the two things it opens: a court's chain-link gate (physical, LOCKED → OPEN, keypad PIN `••• •••` → `482 913`) and a video course (digital, blurred and locked → clear). Two lines of gateway tape underneath. The pair cycles every 9 s; under reduced motion it shows the open state, still.

## 4. Page map

All routes live under `/{locale}` (`en`, `fr`); `/` redirects to the visitor's preferred language (fallback English).

| Route | Purpose | Sections, in order |
|-|-|-|
| `/` | Explain the idea in 30 seconds and push into the demo | Hero · "Three kinds of key" (timed / metered / keep forever as key cards with live meters, the focal section) · "Doors or downloads, the same key" (physical and digital, each with a photo and examples, then a "Plugs into" strip: smart locks, offline PIN keypads, NFC and QR readers, gate relays, web SDK and webhooks) · "Where gates live" (tennis court, baseball diamond, rehearsal room, livestream, each linked to its gate) · FAQ (4) · closing CTA. |
| `/app` | Visitor view: your keys and the gates | Wallet gate (when disconnected) · "Your keys" (key cards: active, running low, expired) · Gates catalogue (photo, plate, surface · kind of key, title, owner, price) with filters All · Physical · Digital · Timed · Metered · Keep forever |
| `/app/gate/[id]` | One gate, unlock-first | Left: photo carousel with the gate's plate and Physical/Digital badge · kind, title, place, description · owner row ("You pay" + avatar + name + addresses) · "Behind the gate" (the reveal). Right, sticky: the **Unlock panel** (rule, units when buying, the Unlock button and its stage track, PIN or "unlocked on this device", your key card with Renew / Buy more) · "At this gate" tape (5 + Show more) |
| `/app/console` | Owner view: Harbour Street Works' gates | Revenue and keys summary · your gates (pause/resume) · holders (5 + Show more) |
| `/app/console/new` | Publish a gate | Kind (court, room, locker, stream, video, document, board) · title and description · rule sentence · gateway action (webhook URL for physical gates) · live key preview · Publish |
| `/app/gateway` | What the gateway sees | Info tip · check a key at the gate · access tape |
| `/how-it-works` | Mechanics for developers and students | Lifecycle (rule → payment → key → check → unlock → expiry, renew loop) · the rule (fields, Riverside court example) · contract events (disclosure) · what the gateway does (webhook payload to a court gate, disclosure) · **where it plugs in** (physical: smart locks, offline keypads, NFC/QR readers, relays; digital: web SDK, webhooks; a one-call SDK snippet; keypad photo; "illustrative" note) · where it can go next + CTA |
| `/credits` | Photo credits | 24 Unsplash photos, photographers and links |
| `/pricing` | **Internal strategy review only.** Unlinked, `noindex, nofollow`, not in the sitemap | Model · three plans · fee maths on a $3, $15 and $180 sale · reasoning |
| 404 | Localized not found | "No key opens this door." · locked door · links home and to the demo |

**Header, footer, mobile:** unchanged from the first version (one top bar on marketing pages; inside `/app` the demo bar carries Keys · Console · Gateway and Demo controls; phones get a bottom tab bar; footer with "Demo · simulated data" and "Built with Monark").

## 5. Feature highlights

| Feature | User benefit | Where | Proved by |
|-|-|-|-|
| Three kinds of key | Charge for exactly what is used: time, entries, or once | Home focal section, key cards, rule builder, catalogue filters | Flows 2, 3, 4 |
| One Unlock button | Pay and get in with one action | Gate page Unlock panel | Flow 2 (cage, new key) and 3 (court, existing key) |
| Physical and digital with the same key | One product for courts, rooms, lockers, streams, courses and files | Home split, Physical/Digital badges and filters, the reveal per kind | Flows 2, 3a–3c |
| Hardware story | Owners see how it plugs into locks they can buy | Home "Plugs into", `/how-it-works` integrations | — |
| Owners on every gate | Buyers know who they pay | Gate owner row, catalogue | All gate pages |
| Keys that run out by themselves | No manual revoking, no padlock codes | Key meters, "Fast-forward" demo control, Renew & unlock | Flow 3d |
| Gateway check and tape | Only valid keys open anything; every check is logged | Gate page tape, `/app/gateway` | Flow 5 |

## 6. Key flows

All transactions go through a simulated wallet prompt (Approve / Reject, testnet disclaimer) and a simulated network with 1.6–2.6 s latency. "Demo controls" can fail the next transaction, fast-forward the clock, top up test tokens and reset.

1. **Connect the demo wallet.** As before: wallet gate → prompt → connected; Reject shows "You declined the connection request. Nothing was shared."
2. **Unlock a gate you have no key for.** *Pine St. basketball cage* → choose 2 hours (6 tUSDC) → **"Unlock · 6 tUSDC"** → prompt ("Buy a key for …", pay to Harbourview Parks & Recreation) → pending → the key is **minted** (code types out, the new key card flashes) → **key in** (a key slides into the padlock in the button) → **check** (it turns while the gateway reads the key on-chain) → **open** (the shackle lifts, the button turns to the key colour): a 6-digit keypad PIN, "Gate open · relocks in 10 s", "Or tap your phone on the reader"; behind the gate the chain-link leaf swings open. **Failed:** rejected signature, network failure (Try again), not enough balance (inline error + top up; the button is disabled).
3. **Unlock with a key you hold.** (a) *Riverside tennis court 2*, metered: "Unlock" → key in → check → open, one entry spent (3 → 2 of 10). (b) *Rooftop session*, timed digital: the stream comes into focus and plays. (c) *The Lowwater Report*, keep forever: the full report comes into focus. (d) After "+1 day", the 2-hour cage key has expired: the button reads "Renew & unlock · 3 tUSDC", and the key card shows EXPIRED.
4. **Publish a gate (owner).** Console → New gate → kind, rule sentence, webhook for physical gates → live key preview → Publish → prompt → live. Validation errors inline.
5. **Check a key at the gate (gateway).** Enter or pick a code → Granted (holder, expiry or entries left, block) or Denied with the reason. Every event lands on the access tape.

## 7. Content (EN / FR)

Tone: **plain, concrete, a little dry**, written for owners first. French is written natively ("clé", "accès", "NIP", "grille", keeps "on-chain"). All strings live in `src/i18n/dictionaries/{en,fr}.ts`.

| Where | EN | FR |
|-|-|-|
| H1 · sub | Pay once. Unlock anything. · Digital keys that open courts, rooms and lockers, or streams and files. Timed, metered, or yours forever. | Payez une fois. Ouvrez tout. · Des clés numériques qui ouvrent terrains, salles et casiers, ou diffusions et fichiers. À durée, à l'usage ou à vie. |
| Kinds of key | Timed key · Metered key · Keep-forever key | Clé à durée · Clé à l'usage · Clé à vie |
| Key cards | **Timed** · Opens for a set time, then locks itself. **Metered** · Each unlock spends one entry. At zero, it stays shut. **Keep forever** · Pay once. It opens every time, for good. | **À durée** · Ouvre pendant un temps donné, puis se verrouille seule. **À l'usage** · Chaque ouverture coûte une entrée. À zéro, ça reste fermé. **À vie** · Payée une fois, elle ouvre à chaque fois, pour de bon. |
| Split | Doors or downloads, the same key · Plugs into | Une porte ou un fichier, la même clé · Se branche sur |
| FAQ | Do buyers need an account? · What happens when a key runs out? · Which locks does it work with? · Can a city use it for courts? | Faut-il un compte pour acheter ? · Que se passe-t-il quand une clé est épuisée ? · Avec quelles serrures ça fonctionne ? · Une ville peut-elle s'en servir pour ses terrains ? |
| Closing | Court 2 is free at six. · Unlock the court | Le terrain 2 est libre à 18 h. · Ouvrir le terrain |
| Unlock button | Unlock · 6 tUSDC / Unlock / Renew & unlock · 3 tUSDC / Connect wallet to unlock | Ouvrir · 6 tUSDC / Ouvrir / Renouveler et ouvrir · 3 tUSDC / Connecter le portefeuille pour ouvrir |
| Stages | Minting your key · Key in · Checking on-chain · Unlocked (track: Mint · Key in · Check · Open) | Création de votre clé · Clé insérée · Vérification on-chain · Ouvert (Création · Insertion · Contrôle · Ouvert) |
| Physical result | Keypad PIN · Gate open · relocks in 10 s · Or tap your phone on the reader | NIP du clavier · Grille ouverte · se reverrouille dans 10 s · Ou approchez votre téléphone du lecteur |
| Owner | You pay | Vous payez |
| Denied | Key expired {date}. Renew to get back in. · No entries left on this key. | Clé expirée le {date}. Renouvelez pour entrer. · Plus aucune entrée sur cette clé. |
| 404 | No key opens this door. | Aucune clé n'ouvre cette porte. |

Disclaimers unchanged: the testnet line once per transaction in the wallet prompt; "Demo · simulated data" in the footer; "Built with Monark" credit.

## 8. Aesthetics

**Concept: "Aquamarine keys."** GatePay is a security product that happens to run on a blockchain: what it sells is a key. The identity borrows from access hardware and terminals (keycards, keypads, lock displays, an engineering grid) rather than from tickets or fintech: one cool aquamarine hue, tinted surfaces, a monospaced voice for everything the system says, and mechanical motion that acts out an unlock.

### Palette

One hue (aquamarine, oklch h≈172–195), defined in `src/app/globals.css` as oklch values. Strong aquamarine means OPEN or "your key"; the key surface is a light aquamarine (dark teal in dark mode); LOCKED plates are the inverse of the page. `destructive` is kept only for real errors and denials. Values below are the sRGB equivalents.

| Role | Light | Dark |
|-|-|-|
| background | `#F1F9F7` | `#041213` |
| foreground | `#0E2120` | `#E3F3EE` |
| card | `#FBFEFD` | `#081B1B` |
| primary | `#007463` | `#5FCBAC` |
| primary-foreground | `#F6FEFC` | `#001917` |
| muted | `#E0EFEB` | `#142726` |
| muted-foreground | `#4E6262` | `#9BB4AF` |
| accent | `#C5EDE2` | `#0A3831` |
| accent-foreground | `#003730` | `#C7F3E4` |
| key (key card surface) | `#AFEED9` | `#00382D` |
| key-foreground | `#00322B` | `#B2F5DD` |
| border | `#CDDDDA` | `#243736` |
| input | `#738C88` | `#506966` |
| destructive | `#B42318` | `#F2776B` |
| plate (LOCKED) | foreground | foreground |

**WCAG AA checks** (computed from the tokens):

| Pair | Light | Dark |
|-|-|-|
| foreground / background | 15.65 | 16.57 |
| foreground / card | 16.55 | 15.49 |
| muted-foreground / background | 6.03 | 8.67 |
| muted-foreground / card | 6.37 | 8.10 |
| muted-foreground / muted | 5.45 | 7.12 |
| primary-foreground / primary | 5.53 | 9.26 |
| primary / background (links, OPEN) | 5.30 | 9.64 |
| primary / card | 5.60 | 9.02 |
| accent-foreground / accent | 10.42 | 10.67 |
| key-foreground / key | 10.73 | 10.65 |
| destructive-foreground / destructive | 6.57 | 7.05 |
| destructive / card | 6.49 | 6.47 |
| input / background (UI, 3:1) | 3.35 | 3.23 |

Text on the key surface always uses `key-foreground`: `primary` on `key` is only 4.33:1 in light mode, so it is never used for text.

### Type

Two families via `next/font/google`:

- **JetBrains Mono** (400–800): headings, buttons, labels, codes, amounts, the tape: the voice of a lock's display.
- **Inter**: paragraphs and long labels, so body copy (and French) stays easy to read.

### Logo and favicon

A rounded-square **gate with a keyhole** cut through it; the tooth on the keyhole's stem is the bit of a key (gate and key in one mark). Even-odd single path, `currentColor`; aquamarine on the ground. Wordmark "GatePay" in JetBrains Mono 700. Files: `src/components/site/logo.tsx`, `src/app/icon.svg`, `public/brand/gatepay-mark.svg`; the OG image uses mark + tagline + a metered key card.

### Shape, depth, motion

- **Radius:** 6px; key cards and feature cards 8–10px. Borders over shadows; a 2px bottom edge on primary buttons.
- **Texture:** a faint 28px engineering grid behind the hero, the closing band and the CTA card only.
- **Motion:** mechanical, 120–560ms per beat, `cubic-bezier(.2,.8,.2,1)`. Under `prefers-reduced-motion` every animation collapses; the unlock still goes through its states (shorter beats) and lands in its end state (gate open, shackle up, content clear).

### Imagery

Cool, natural-light documentary photos of places where access is sold: fenced courts, a chain-locked gate, a baseball backstop, a studio mic, a live gig filmed on a phone, a ceramics studio, lockers, a keypad. Two warm originals (an ON AIR sign, an orange-lit stage) were replaced by cool versions of the same subjects. Every gate has 3 photos (carousel); people who own gates have portraits.

### Signature moments

1. **The unlock.** One button acts out the story in four beats: the key is **minted** (its code types out), slides **in** to the padlock drawn in the button, **turns** while the gateway checks on-chain, and the shackle **lifts**. Physical gates answer with a keypad PIN and a swinging chain-link leaf that relocks after 10 s; digital ones bring the content into focus. A stage track under the button says each beat in words (and to screen readers).
2. **Key meters.** Every key card shows what's left: a bar draining with the clock (timed), entry segments that empty one by one (metered), or a full bar and ∞ (keep forever). Expired and spent keys dim and get an EXPIRED / USED UP tag.
3. **Gateway tape.** Checks type onto the access tape in mono: `key GP-4K7Q-2M verified · block …` → `gate.unlock → 200 OK · 142 ms`.

### What we deliberately avoid, and why

- **Tickets** (perforations, stubs, punches): another Monark demo (NFTokenPass) owns that metaphor, and GatePay sells keys.
- **Several accent colours:** the first version's verdigris + brass + rust read as scattered; states are now tones of one hue plus a label.
- **Purple/blue "AI" gradients, glass, neon, glowing coins, padlock-on-circuit-board clichés, Monark orange.**

## 9. Assets

24 Unsplash photos (free licence) in `public/images/`, listed with photographers and pages in `docs/assets.md` and credited on `/credits` (`src/lib/photos.ts`). Three per gate for the carousels (courts, studio, stream, kiln course, lockers), two owner portraits, one keypad for `/how-it-works`.

Built in code: logo mark and favicon, hero visual, key card (contact chip, meters, watermark), padlock glyph and unlock stages, door/locker/chain-link gate diagrams with keypad, document and board covers, owner monograms, lifecycle diagram, OG image.

## 10. Pricing strategy

**Decision: usage-based protocol fee, with a subscription only for owners who connect physical locks.** A fixed card fee makes a $3 court hour cost 13%; a percentage in the contract keeps it at 2.9%.

| Plan | Price | Protocol fee | For |
|-|-|-|-|
| **Open** | $0 / month | 2.9% | Creators and small owners: unlimited digital gates, hosted gate pages, 3 lock or webhook connections, 30-day log |
| **Venue** | $49 / month | 1.5% | Studios, makerspaces, sports clubs: unlimited locks and webhooks, offline keypad PINs, 13-month logs and CSV, team roles, custom domain |
| **Network** | Custom (from $400 / month) | from 0.75% | Multi-site owners, campuses, cities: SLA, self-hosted gateway, audit support |

`/pricing` is for internal review only: **never linked**, excluded from `sitemap.xml`, `robots: { index: false, follow: false }`.

## Decisions taken while building

- **Three seats, one demo.** Visitor (`/app`), owner console as *Harbour Street Works* (`/app/console`), gateway (`/app/gateway`).
- **Seeded world** (deterministic, `src/lib/demo/seed.ts`): four owners (Harbourview Parks & Recreation and Harbour Street Works as organisations, Camille Brûlé and Noor Haddad as people), nine gates (three city courts, studio, stream, locker, board, kiln course, report), 23 keys. The visitor holds one key of each kind (tennis, metered, 3 of 10 left; the stream, timed; the report, forever) plus an expired course key. Wallet: 40 tUSDC, 20 tDAI, 0.02 tETH, so 2 hours of the cage (6) works and then three diamond blocks (60) shows the insufficient-balance state.
- **One unlock state machine** (`src/components/demo/use-unlock.ts`) drives both the Unlock panel and the reveal behind the gate. Unlocking an existing metered key spends an entry (gateway check with `consume`); timed and forever keys don't.
- **Physical unlocks** show a 6-digit PIN derived from the key and the gate (`gatePin` in `lib/demo/ids.ts`), the way offline keypads compute time-bound PINs; it is illustrative.
- **Carousel without a dependency:** CSS scroll-snap, buttons, dots, arrow keys, labelled slides (`gate-carousel.tsx`).
- **Plates follow the gate, not the key:** OPEN only while the gate is unlocked (digital: until you leave; physical: 10 s).
- **Storage** moved to `gatepay-demo-v2`; older saved demos are ignored and reseeded.
- **Screenshots** are taken with Playwright's `animations: "disabled"`: headless Chrome only advances CSS animations when it draws a frame, which otherwise leaves type-in lines half-clipped in captures.

## 11. Out of scope

- Real chains, wallets, contracts, webhooks, locks or keypads (all simulated in `src/lib/demo/`).
- **The SDK and the hardware integrations are illustrative:** `/how-it-works` shows what they would look like and says so. No real API, SDK package or device integration ships.
- Key transfers and resale, refunds, per-minute streaming, keys covering several gates (listed as next steps on `/how-it-works`).
- Accounts, email, notifications, fiat on-ramps, real price feeds, multi-owner teams.
