# GatePay site plan

GatePay is an independent product incubated by Monark (`monark-branded: false`). It has its own identity; Monark appears only as a "Built with Monark" footer credit. This plan is the source of truth for what ships and is kept in sync with the code. Decisions taken without the owner are marked **Decision**.

Sources read: the Lovable app on `main` (`src/`), https://gatepay.monark.io/, and the authoritative project documentation (the `access-tokens-pay-per-access-contracts` entry of the monark.io `website` repo, which is what https://www.monark.io/en/project/access-tokens-pay-per-access-contracts renders).

---

## 1. Product brief

**What the documentation says.** Smart contracts that grant time-based or one-time access to digital or physical things. A publisher defines the asset, the access rule, the price, the duration and the token. A buyer pays from a wallet; the payment records a pass on-chain; an access gateway verifies the pass and then reveals content or triggers an action (play a stream, open a file, unlock a smart lock, broadcast an alert). Access can be limited by time, frequency or usage volume, and expires on its own, so the buyer renews or buys again. Milestones: access portal, contract access logic, token payments, gateway and verification layer, admin dashboard, access logs and analytics, device and broadcast integrations.

**Target users.**

- **Primary: small operators who sell access to something they already own.** A rehearsal studio renting a room by the hour, a makerspace renting lockers per use, a band selling a livestream, a researcher selling a report, a teacher selling a video course, a local alert channel. Today they juggle a booking tool, a card processor, a door code they change by hand and a membership plugin.
- **Secondary: the people who pay.** They want to pay for exactly what they use (two hours, five opens, one report) with no account and no subscription to cancel.
- **Tertiary: developers and students** who wire the gateway to a door, a player or a webhook. The documentation frames this as a student project that teaches contract permissions and event-driven programming.

**Core job to be done.** "When someone pays, let them in for exactly what they paid for, and lock again when it runs out, without me doing anything."

**Domain concepts** (used consistently across the site):

| Concept | Meaning |
|-|-|
| Gate | Something sold behind a rule: a stream, a video, a document, a device (lock, locker) or an alert channel. Owned by one address. |
| Rule | How access is sold: a **time pass** (N hours or days per unit), a **metered pass** (N uses per unit) or a **keep-forever** unlock. Plus price per unit, token, max units per purchase. |
| Pass | The on-chain record a payment creates: holder, gate, start, expiry or uses left, token id and a short code (`GP-4K7Q-2M`). |
| Gateway | The layer that checks a pass on-chain and performs the action: reveal, play, `door.unlock` webhook, broadcast. Every check is logged. |
| Access log | The tape of payments, checks, actions, denials and expiries, per gate. |

**What the Lovable version got wrong or left out.**

- It pitched "infrastructure for platforms" with a purple-blue gradient, glass cards and six generic industry tiles, but nothing on the page worked: "Unlock Access" did nothing, and the dashboard was API keys and "Coming soon" panels.
- It never showed the actual idea: **a rule turns into a pass, a pass opens something, and the pass runs out.** No countdown, no uses left, no expiry, no renewal, no gateway check, no denied state.
- Prices were in ETH (0.1 ETH for a course), which makes pay-per-access look expensive and volatile; the point of the product is small, exact payments.
- Physical access (smart locks) and paid alerts, both central in the documentation, were a single tile each.
- The pricing page was linked from the header and invented "cross-chain" fees.

## 2. Value proposition

> **For studios, creators and makerspaces that sell access to rooms, streams and files, GatePay turns a small token payment into a pass with rules (how long it lasts, how many times it opens) that any door, player or page checks on-chain, so they can charge per hour or per use without accounts, subscriptions or card fees that make a $2 sale pointless.**

Three benefits, as outcomes:

1. **You get paid for every hour and every open, even the $2 ones.** No fixed card fee eating small sales, no monthly minimum for buyers.
2. **Nobody gets in on an expired pass, and you never change a door code again.** The pass carries its own expiry or use count; the gateway checks it at the door.
3. **Buyers pay once and walk in.** No account, no password, no subscription to forget to cancel: the pass is in their wallet, with a countdown they can see.

## 3. Hero

- **Headline (9 words):** "Sell access by the hour, the use, or forever."
  FR: « Vendez l'accès à l'heure, à l'usage ou pour de bon. »
- **Subheadline:** "GatePay turns a token payment into a pass with rules: how long it lasts, how many times it opens. Doors, streams and files check the pass on-chain, and lock again when it runs out."
  FR: « GatePay transforme un paiement en jetons en laissez-passer avec des règles : combien de temps il dure, combien de fois il ouvre. Portes, diffusions et fichiers le vérifient on-chain, puis se referment quand il est épuisé. »
- **Primary CTA:** "Try the demo" → `/{locale}/app`. FR « Essayer la démo ».
- **Secondary CTA:** "How a pass works" → `/{locale}/how-it-works`. FR « Comment fonctionne un laissez-passer ».
- **Hero visual: the product itself**, drawn in code. A "gate plate" for *Studio B · rehearsal room* (status LOCKED/OPEN, a live-looking countdown) with a brass pass stub clipped to it (2 h, 24 tUSDC, code `GP-4K7Q-2M`) and three lines of gateway tape underneath (`payment seen`, `pass verified`, `door.unlock → 200 OK`). It shows rule, pass and door in one glance, which a photo or illustration can't. The plate flips from LOCKED to OPEN once on load (disabled with reduced motion).

## 4. Page map

All routes live under `/{locale}` (`en`, `fr`); `/` redirects to the visitor's preferred language (fallback English).

| Route | Purpose | Sections, in order |
|-|-|-|
| `/` | Explain the idea in 30 seconds and push into the demo | Hero with gate plate · "Three ways to sell access" (time / metered / forever stubs) · "From payment to open door" (4 steps + gateway tape) · "Where gates live" (4 photos, each linked to its demo gate) · Benefits (3 outcomes) · FAQ · Closing CTA |
| `/app` | Visitor view of the demo: browse gates and hold passes | Wallet gate (when disconnected) · "Your passes" rail (active, running low, expired) · Catalogue of gates with filters by kind · empty states |
| `/app/gate/[id]` | One gate: buy, use, renew | Cover + rule sentence · Buy panel (units, total, balance, disclaimer) · Your pass (stub, countdown/uses, Use button, Renew) · Access result (door, player, document or alert) · Recent activity for this gate |
| `/app/console` | Operator view: gates you own | Revenue and passes summary · Your gates (status, sold, active, revenue, pause/resume) · Holders of the selected gate |
| `/app/console/new` | Publish a gate with the rule builder | Kind · Title and description · Rule sentence (access type, price, token, duration or uses, max units) · Gateway action (reveal, play, webhook URL, broadcast) · Live stub preview · Publish |
| `/app/gateway` | What the gateway sees | Door check (pick gate, enter pass code, check) · Access tape (all events, filter by gate, empty state) |
| `/how-it-works` | Mechanics for developers and students | Lifecycle diagram · The rule (fields) · What the contract records (events) · What the gateway does (verification rules + webhook payload) · Expiry and renewal · CTA to the demo |
| `/credits` | Photo credits (required by the asset rules) | Photographers and links · "Built with Monark" |
| `/pricing` | **Internal strategy review only.** Unlinked, `noindex, nofollow`, not in the sitemap | Model · three plans · fee maths on a $2, $24 and $180 sale · reasoning |
| 404 | Localized not found | Locked gate illustration · links home and to the demo |

**Why each extra page exists.** `/how-it-works` serves the tertiary audience the documentation targets (students building the contract and the gateway); without it the home page would have to carry payloads and event names. `/credits` is required to credit photographers. There is no `/use-cases`: the four photo cards and the demo gates already cover streams, files, rooms, lockers and alerts.

**Header:** GatePay mark + wordmark (home) · links "Demo" (`/app`), "How it works" · EN/FR switch · theme toggle · primary pill "Try the demo". Inside `/app` the header action becomes the wallet (`connect-wallet`) and a "Demo · simulated data" badge sits next to the logo; the app has its own sub-navigation: Passes · Console · Gateway, plus "Demo controls".
**Mobile:** mark + menu button opening a full-height sheet with the links, switches and action. App sub-navigation becomes a sticky bottom bar.
**Footer:** one-line description · links (Demo, How it works, Credits) · "Demo · simulated data" · "Testnet demo · not financial advice · no real funds" · "Built with Monark" credit · project documentation and GitHub links · © year GatePay.

## 5. Feature highlights

| Feature | User benefit | Where | Proved by |
|-|-|-|-|
| Rules, not memberships (time / metered / forever) | Charge for exactly what is used | Home "Three ways", rule builder | Flow 4 (publish) and Flow 2 (buy 2 hours of Studio B) |
| Passes that run out by themselves | No manual revoking, no door codes | Pass stub countdown, "Fast-forward" demo control | Flow 3 (use, expire, renew) |
| Gateway check at the door | Only valid passes open anything; every check logged | Gate page "Open the door", `/app/gateway` | Flow 3 and Flow 5 |
| Physical and broadcast actions | One product for rooms, lockers, streams and alerts | Webhook `door.unlock`, alert broadcast | Flow 3 (Studio B door, Locker 14, Swell alerts) |
| Operator console with holders and revenue | See who holds what and what it earned | `/app/console` | Flow 4 and the seeded Studio B stats |

## 6. Key flows

All transactions go through a simulated wallet prompt (Approve / Reject) and a simulated network with 1.6–2.6 s latency. "Demo controls" can make the next transaction fail, fast-forward the demo clock (+1 hour, +1 day), top up test tokens and reset the demo.

1. **Connect the demo wallet.** `/app` shows a wallet gate → "Connect demo wallet" → prompt → *connecting* (spinner in the button) → *connected*: passes and catalogue appear. **Failed:** Reject → "You declined the connection request. Nothing was shared." with a retry.
2. **Buy a pass.** Catalogue → *Studio B* → choose 2 hours (total 24 tUSDC, balance shown) → "Pay 24 tUSDC" → prompt with summary (pay to the gate contract, pass terms, network fee) → *pending*: tx-status with hash, "Waiting for the network…" → *confirmed*: the stub is punched, the plate flips to OPEN, the pass appears with a 2 h countdown, balance drops. **Failed:** rejected signature ("You declined. Nothing was charged."), insufficient balance (Pay disabled, inline error + "Top up test tUSDC"), network failure via demo control ("The transaction failed on the network. Nothing was charged." + Try again).
3. **Use the pass, watch it run out, renew.** On a gate with a pass → "Open the door" / "Play the stream" / "Open the report" / "Receive the next alert" / "Open locker" → *checking* ("Checking your pass on-chain…") → *granted*: the door unlocks for 10 s with a `door.unlock → 200 OK` tape line; the player starts; the document appears; a metered pass drops one use. **Denied:** after "Fast-forward +1 day" the pass shows EXPIRED, the gateway refuses with the reason and the expiry date, and "Renew" buys more time (renewal extends from the later of now and the old expiry). A metered pass with 0 uses left offers "Buy more opens".
4. **Publish a gate (operator).** Console → "New gate" → pick a kind → fill the rule sentence ("Sell a *time pass* of *1 hour* for *12 tUSDC*, up to *4* per purchase") → gateway action (webhook URL for devices) → live stub preview → "Publish gate" → prompt → *pending* → *live*: it appears in the console and the catalogue. **Failed:** validation errors inline (missing title, price 0, invalid webhook URL), network failure with retry. Pausing and resuming sales are also transactions.
5. **Check a pass at the door (gateway).** `/app/gateway` → choose a gate → type or pick a pass code → "Check" → *checking* → **Granted** (holder, expiry or uses left, block) or **Denied** with the reason: expired, no uses left, wrong gate, unknown code. The access tape lists every payment, check, action, denial and expiry, filterable by gate, with an empty state.

## 7. Content (EN / FR)

Tone: **plain, concrete, a little dry.** Written for operators first (studio managers, makers, musicians), with exact numbers and verbs instead of Web3 jargon. French is written natively for Quebec and France readers ("laissez-passer", "portefeuille", keeps "on-chain"). All strings live in `src/i18n/dictionaries/{en,fr}.ts`; below is the copy they carry.

### Home

| Section | EN | FR |
|-|-|-|
| Eyebrow | Pay-per-access passes | Laissez-passer à l'accès |
| H1 | Sell access by the hour, the use, or forever. | Vendez l'accès à l'heure, à l'usage ou pour de bon. |
| Sub | GatePay turns a token payment into a pass with rules: how long it lasts, how many times it opens. Doors, streams and files check the pass on-chain, and lock again when it runs out. | GatePay transforme un paiement en jetons en laissez-passer avec des règles : combien de temps il dure, combien de fois il ouvre. Portes, diffusions et fichiers le vérifient on-chain, puis se referment quand il est épuisé. |
| CTAs | Try the demo · How a pass works | Essayer la démo · Comment fonctionne un laissez-passer |
| "Three ways" H2 | Three ways to sell access | Trois façons de vendre l'accès |
| Intro | Every gate has one rule. The rule decides what a payment buys. | Chaque accès a une règle. La règle décide de ce qu'un paiement achète. |
| Time pass | **Time pass.** 48 hours of the rooftop session and its replay. The pass counts down and locks at the end. | **Laissez-passer à durée.** 48 heures de la session sur le toit et de sa rediffusion. Il se décompte et se verrouille à la fin. |
| Metered | **Metered pass.** Five opens of Locker 14. Each open uses one; at zero, the locker stays shut. | **Laissez-passer à l'usage.** Cinq ouvertures du casier 14. Chaque ouverture en consomme une ; à zéro, le casier reste fermé. |
| Forever | **Keep forever.** The Lowwater Report, paid once, readable any time from the same wallet. | **Pour de bon.** Le rapport Lowwater, payé une fois, lisible en tout temps depuis le même portefeuille. |
| Steps H2 | From payment to open door | Du paiement à la porte ouverte |
| Step 1 | **Set the rule.** Price, token, and what one unit buys: an hour, five opens, or the file for good. | **Fixez la règle.** Prix, jeton et ce qu'achète une unité : une heure, cinq ouvertures ou le fichier pour de bon. |
| Step 2 | **They pay from a wallet.** One transaction, no account. The contract records the pass. | **On paie depuis un portefeuille.** Une transaction, aucun compte. Le contrat enregistre le laissez-passer. |
| Step 3 | **The gateway checks.** At the door, the player or the page, it reads the pass on-chain before doing anything. | **La passerelle vérifie.** À la porte, au lecteur ou sur la page, elle lit le laissez-passer on-chain avant d'agir. |
| Step 4 | **It locks again.** When time or uses run out, access stops. Renewing is one more payment. | **Ça se referme.** Quand le temps ou les usages sont épuisés, l'accès s'arrête. Renouveler, c'est un paiement de plus. |
| Places H2 | Where gates live | Là où vivent les accès |
| Cards | A rehearsal room rented by the hour · A livestream with a 48-hour replay · A course sold for 30 days · A locker paid per open | Un local de répétition loué à l'heure · Une diffusion en direct avec 48 h de rediffusion · Un cours vendu pour 30 jours · Un casier payé à l'ouverture |
| Benefits H2 | What changes for you | Ce qui change pour vous |
| Benefit 1 | **Every hour and every open gets paid, even the $2 ones.** No fixed card fee eating small sales. | **Chaque heure et chaque ouverture sont payées, même à 2 $.** Aucuns frais fixes de carte qui mangent les petites ventes. |
| Benefit 2 | **Nobody gets in on an expired pass.** The pass carries its own end. You never change a door code again. | **Personne n'entre avec un laissez-passer expiré.** Il porte sa propre échéance. Fini de changer le code de la porte. |
| Benefit 3 | **Buyers pay once and walk in.** No account, no subscription to cancel, a countdown they can see. | **On paie une fois et on entre.** Aucun compte, aucun abonnement à résilier, un décompte bien visible. |
| Closing | Two hours of Studio B are waiting. Buy them with test tokens and open the door. · Open the demo | Deux heures au studio B vous attendent. Achetez-les en jetons de test et ouvrez la porte. · Ouvrir la démo |

### FAQ

| EN | FR |
|-|-|
| **Do buyers need an account?** No. The wallet that paid is the proof. The pass is tied to that address, and the gateway checks it there. | **Faut-il un compte pour acheter ?** Non. Le portefeuille qui a payé fait foi. Le laissez-passer est lié à cette adresse et la passerelle la vérifie. |
| **What happens when a pass runs out?** The gateway refuses it and says why: expired on a date, or no uses left. Renewing extends from the old end date, so nobody loses time by paying early. | **Que se passe-t-il quand un laissez-passer est épuisé ?** La passerelle le refuse et explique pourquoi : expiré à telle date ou plus d'usages. Le renouvellement repart de l'ancienne échéance ; payer d'avance ne fait rien perdre. |
| **Can it open a real door?** Yes, through the gateway. It calls your lock's webhook (`door.unlock`) only after the on-chain check passes. In this demo the door is simulated. | **Est-ce que ça ouvre une vraie porte ?** Oui, par la passerelle. Elle appelle le webhook de votre serrure (`door.unlock`) seulement après la vérification on-chain. Ici, la porte est simulée. |
| **Can a pass be shared?** A pass belongs to the address that paid. Operators can allow transfer per gate; this demo keeps passes non-transferable. | **Peut-on partager un laissez-passer ?** Il appartient à l'adresse qui a payé. L'exploitant peut permettre le transfert par accès ; cette démo les garde non transférables. |
| **Which tokens can I charge in?** Any token the gate allows. The demo uses test tokens: tUSDC, tDAI and tETH on a testnet. | **Dans quels jetons puis-je facturer ?** Ceux que l'accès autorise. La démo utilise des jetons de test : tUSDC, tDAI et tETH sur un réseau de test. |
| **Is any of this real money?** No. Everything here is simulated: the wallet, the network, the payments and the doors. | **Est-ce du vrai argent ?** Non. Tout est simulé ici : le portefeuille, le réseau, les paiements et les portes. |

### App: key strings, empty and error states

| Where | EN | FR |
|-|-|-|
| Wallet gate | Connect the demo wallet to buy and use passes. It's simulated: no extension, no real funds. | Connectez le portefeuille de démo pour acheter et utiliser des laissez-passer. Tout est simulé : aucune extension, aucun vrai fonds. |
| Connect rejected | You declined the connection request. Nothing was shared. | Vous avez refusé la demande de connexion. Rien n'a été partagé. |
| No passes | No passes yet. Pick a gate below and buy one with test tokens. | Aucun laissez-passer pour l'instant. Choisissez un accès ci-dessous et payez en jetons de test. |
| Filter empty | No gates of this kind yet. | Aucun accès de ce type pour l'instant. |
| Pending | Waiting for the network… | En attente du réseau… |
| Rejected | You declined. Nothing was charged. | Vous avez refusé. Rien n'a été prélevé. |
| Network failure | The transaction failed on the network. Nothing was charged. | La transaction a échoué sur le réseau. Rien n'a été prélevé. |
| Insufficient | Not enough tUSDC: you have 6, this costs 24. | Pas assez de tUSDC : vous en avez 6, il en faut 24. |
| Checking | Checking your pass on-chain… | Vérification du laissez-passer on-chain… |
| Denied, expired | Pass expired on Oct 1, 14:00. Renew to get back in. | Laissez-passer expiré le 1 oct., 14 h. Renouvelez pour entrer. |
| Denied, uses | No opens left on this pass. | Plus aucune ouverture sur ce laissez-passer. |
| Console empty | You haven't published a gate yet. | Vous n'avez encore publié aucun accès. |
| No holders | Nobody holds a pass for this gate yet. | Personne ne détient encore de laissez-passer pour cet accès. |
| Tape empty | Nothing has happened at this gate yet. | Rien ne s'est encore passé à cet accès. |
| Unknown code | No pass with this code on this gate. | Aucun laissez-passer avec ce code pour cet accès. |
| Storage off | Your browser blocks storage, so the demo resets when you leave. | Votre navigateur bloque le stockage : la démo repart à zéro quand vous partez. |
| Page error | Something jammed. Try again, or reset the demo. | Quelque chose s'est coincé. Réessayez ou réinitialisez la démo. |
| 404 | This door doesn't exist. The page you asked for isn't here. | Cette porte n'existe pas. La page demandée n'est pas ici. |

Disclaimers everywhere value moves: "Testnet demo · not financial advice · no real funds" / « Démo sur réseau de test · pas un conseil financier · aucun vrai fonds ». Site-wide: "Demo · simulated data" / « Démo · données simulées ». Credit: "Built with Monark" / « Propulsé par Monark ».

## 8. Aesthetics

**Concept: "Brass hardware, punched paper."** GatePay lives where money meets a door: the ticket stub, the turnstile, the key tag, the brass plate on a studio door, the red ON AIR light. Its users run physical places and small media operations, not trading desks, so the brand borrows from hardware and paper rather than from fintech: flat inks, printed perforations, stamped states, mechanical motion. It reads as trustworthy (it's a lock) and tactile (it's a ticket), and it looks nothing like a crypto dashboard.

### Palette

Verdigris (the green of old copper door hardware) is the brand colour and means OPEN. Brass is the pass. Ink is LOCKED. Rust is EXPIRED. Paper is the ground.

| Role | Light ("paper") | Dark ("night door") |
|-|-|-|
| background | `#F4F1E8` | `#111614` |
| foreground | `#1B1F1C` | `#ECE8DC` |
| card | `#FBFAF5` | `#18201C` |
| primary (verdigris) | `#0E5A4E` | `#63C7AE` |
| primary-foreground | `#F7F5EE` | `#0A1A15` |
| muted | `#E8E3D5` | `#1F2925` |
| muted-foreground | `#565B53` | `#A3AA9E` |
| accent (brass stub) | `#EFDDA6` | `#3A3219` |
| accent-foreground | `#3B2F05` | `#F1D98C` |
| border / input | `#D3CCB8` | `#2E3934` |
| ring | `#0E5A4E` | `#63C7AE` |
| destructive | `#B42318` | `#F2776B` |
| brass (text/icon) | `#8A6414` | `#E2BE5C` |
| rust / expired | `#9A4A24` | `#E58A62` |
| chart-1…5 | `#0E5A4E` `#A87B12` `#9A4A24` `#46687A` `#6B7440` | `#63C7AE` `#E2BE5C` `#E58A62` `#8FB3C6` `#B5BE7E` |

**WCAG AA checks** (computed, all text pairs ≥ 4.5:1):

| Pair | Light | Dark |
|-|-|-|
| foreground / background | 14.76 | 14.92 |
| foreground / card | 15.96 | 13.58 |
| primary-foreground / primary | 7.43 | 8.80 |
| primary / background (links, OPEN) | 7.18 | 8.98 |
| muted-foreground / background | 6.16 | 7.66 |
| muted-foreground / muted | 5.43 | 6.28 |
| accent-foreground / accent | 9.76 | 9.12 |
| destructive-foreground / destructive | 6.57 | 7.05 |
| destructive / card | 6.29 | 6.04 |
| brass / card | 5.13 | 9.31 |
| rust / card | 5.95 | 6.45 |
| chart-1…5 / card | 7.76 · 3.65 · 5.95 · 5.71 · 4.79 | 8.17 · 9.31 · 6.45 · 7.47 · 8.42 |

Chart-2 light (3.65) is only used for non-text marks, where 3:1 applies. Borders are decorative (1.42 / 1.52); inputs also carry a label and a focus ring.

### Type

Two families via `next/font/google`:

- **Bricolage Grotesque** (400, 500, 600, 700, 800): headings and UI. Its slightly condensed, ink-trap-ish forms feel printed and hand-set, like signage on a workshop door, without being quirky at body size.
- **IBM Plex Mono** (400, 500, 600): pass codes, amounts, countdowns, tx hashes and the gateway tape: the "printed on the ticket" voice.

Scale (rem): display 3.5 → 2.4 on mobile (800, tracking −0.03em) · h1 2.5 · h2 1.9 · h3 1.25 (700) · body 1 (400, 1.6 line height) · small 0.875 · label 0.75 mono uppercase, tracking 0.08em.

### Logo and favicon

A **ticket-keyhole mark**: a rounded ticket with semicircle notches on both sides and a keyhole punched through the centre, verdigris on paper. The wordmark is "GatePay" in Bricolage Grotesque 800 next to it. The favicon is the mark alone (`src/app/icon.svg`); the Open Graph image uses mark + headline + a stub.

### Shape, depth, motion

- **Radius:** 6px (`--radius: 0.375rem`): hardware, not bubbly. Pills only for status plates.
- **Borders over shadows:** 1px ink-tinted borders; dashed 1.5px perforation lines between stub parts; semicircle notches cut with CSS masks. The only shadow is a crisp 0-offset 1px outline plus a 2px bottom "plate" edge on primary buttons.
- **Depth:** flat inks; a single raised surface (`card`) on the paper ground.
- **Motion:** mechanical and short, 120–260 ms, `cubic-bezier(.2,.8,.2,1)`; the plate flip uses a `steps`-like two-phase rotate. Everything honours `prefers-reduced-motion`.

### Imagery

Warm, available-light documentary photos of real places where access is sold: a studio door with an ON AIR light, a phone filming a gig, hands at a pottery wheel, a row of lockers. Amber and teal casts that sit next to brass and verdigris. No people posing at laptops, no handshakes, no padlock-on-circuit-board. Diagrams are drawn in code in the same flat ink style (perforations, stubs, tape).

### Signature moments

1. **Punch and swing.** When a purchase confirms, a hole is punched through the brass stub (scale-in circle with a paper "chad" falling away), and the gate plate flips from LOCKED (ink) to OPEN (verdigris).
2. **The draining stub.** Every pass shows its remaining time or uses as a row of perforation dots that empty in real time. At expiry the stub is stamped EXPIRED at an angle in rust, and the plate swings back to LOCKED.
3. **Gateway tape.** Checks print onto a receipt-like tape one line at a time, in mono: `14:02:11  pass GP-4K7Q-2M verified · block 6 481 223` → `door.unlock → 200 OK · 142 ms`.

### What we deliberately avoid, and why

- **Purple/blue "AI" gradients, glass, neon, glowing coins, 3D blobs:** they were the Lovable version, and they signal speculation. GatePay sells a room for two hours.
- **Default shadcn look** (zinc, rounded-xl cards with soft shadows, Inter): replaced with paper, ink, 6px radius, borders, a grotesque with character and a mono.
- **Fintech navy and Monark orange:** the first is every payments startup; the second is reserved for Monark's own products.
- **Padlock-and-shield security clichés:** the lock is shown as a door plate and a ticket, not as an icon of fear.

## 9. Assets

Photos (Unsplash, free licence, downloaded to `public/images/`, served with `next/image`; details in `docs/assets.md`):

| File | Subject | Where |
|-|-|-|
| `studio-on-air.jpg` | Studio doors with ON AIR lights | Home "Where gates live" (room card) · cover of the *Studio B* gate |
| `livestream-phone.jpg` | A phone filming a guitarist on stage | Home (stream card) · cover of the *Rooftop session* gate |
| `pottery-wheel.jpg` | Hands at a pottery wheel | Home (course card) · cover of the *Wood-fired kiln course* gate |
| `lockers-teal.jpg` | A row of teal lockers | Home (locker card) · cover of *Locker 14* |

Built in code: logo mark and favicon (SVG), hero gate plate, pass stub, perforation dots, stamp, gateway tape, lifecycle diagram on `/how-it-works`, document cover for *The Lowwater Report*, alert-card cover for *Swell alerts*, locked-gate 404 illustration, Open Graph image. Icons: `lucide-react` (DoorOpen, Radio, FileText, Clapperboard, Bell, Lock, Ticket…).

Credits: `/credits` page linked from the footer.

## 10. Pricing strategy

**Decision: usage-based protocol fee, with a subscription only for venues that connect physical devices.** Pay-per-access lives or dies on small payments: a $2 locker open is impossible with a card processor's fixed 30¢ + 2.9%, and memberships (Patreon 8–12%, booking tools $30–$100/month) force buyers into subscriptions they don't want. So GatePay charges a percentage taken in the contract at settlement, with no fixed fee, and makes money on the operators who get the most value (physical venues with devices and logs).

| Plan | Price | Protocol fee | For |
|-|-|-|-|
| **Open** | $0 / month | 2.9% of each pass sale | Creators and small operators: unlimited digital gates, hosted pass pages, 3 device or webhook connections, 30-day access log |
| **Venue** | $49 / month | 1.5% | Studios, makerspaces, co-working: unlimited devices and webhooks, broadcast alerts, 13-month logs and CSV export, team roles, custom domain |
| **Network** | Custom (from $400 / month) | from 0.75% | Multi-site operators, campuses, municipalities: SLA, self-hosted gateway, audit support |

Buyers pay the network fee (fractions of a cent on an L2). Break-even between Open and Venue is ~$3,500 of monthly sales, roughly one rehearsal room rented 10 hours a week. `/pricing` is built as a real page for internal review only: **never linked**, excluded from `sitemap.xml`, and `robots: { index: false, follow: false }`. No other page mentions prices of GatePay itself.

## 11. Out of scope

- Real chains, wallets, signatures, contracts, webhooks or devices (all simulated in `src/lib/demo/`).
- Pass transfers and resale, refunds, per-minute streaming payments, tiered pass bundles (mentioned in the documentation as extensions; noted in `/how-it-works` as possible extensions).
- Accounts, email, notifications, a real API or SDK, and API keys (the Lovable dashboard's API keys are dropped: they were not the product).
- Fiat on-ramps and real price feeds (test tokens are shown at fixed reference prices: tUSDC $1.00, tDAI $1.00, tETH $3,200).
- Multi-operator teams and permissions in the console.
