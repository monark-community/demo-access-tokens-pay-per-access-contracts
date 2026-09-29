# Simplification pass

Owner feedback on the rebuilt sites: *"Simplify, reduce text quantity, revise flows so that context is only given when necessary. Two top bars on homepage is too busy; demo banners only on demo/app pages."*

GatePay is an independent brand, so its header and identity stay as they are. This pass applies the "Restraint" rules (end of §8 of `monark-brand-guidelines.md`), the one-top-bar rule and §11 (disclaimers), following the checklist in the TrustRate pilot (`sites/address-review-system/docs/simplification.md` §4).

How the numbers are measured (both scripts are in `scripts/`, run against `pnpm start -p 3144`):

- `node scripts/wordcount.mjs`: words per page, English, at 1440px. *Visible* is the `innerText` of `<main>`; *total* also counts closed disclosures; *chrome* is everything outside `<main>` (header and footer). On `/app` pages the demo bar is inside `<main>`, and the pages include seeded data (gate titles, descriptions, tape lines, addresses).
- `node scripts/dictcount.mjs`: words of copy in `src/i18n/dictionaries/{en,fr}.ts`, per section.

## 1. Before

| Page | Visible in main | Total in main (incl. collapsed) | Chrome (header, footer) |
|-|-:|-:|-:|
| Home | 486 | 487 | 57 |
| How it works | 496 | 502 | 57 |
| Credits | 99 | 99 | 57 |
| 404 | 31 | 30 | 57 |
| App: wallet gate | 173 | 176 | 57 |
| App: passes | 237 | 240 | 58 |
| App: gate (Studio B) | 178 | 242 | 58 |
| App: console | 253 | 256 | 58 |
| App: publish a gate | 137 | 140 | 58 |
| App: gateway | 474 | 481 | 58 |
| **Total** | **2,564** | **2,653** | **575** |

Dictionary copy: **EN 2,990 words** (meta 53 · common 66 · home 598 · how 430 · credits 49 · notFound 32 · pricing 245 · app 1,096 · seed 369 · units and labels 51); **FR 3,233 words**.

What was loaded:

- **Shell.** Marketing pages already had one top bar. The footer legal band repeated the testnet line on every page. Inside `/app`, the demo bar held the section tabs, a "Demo · simulated data" badge and "Demo controls".
- **Home** had six sections after the hero (ways, steps, places, a dark "What changes for you" band, FAQ, closing): one over budget. Eyebrow, a 33-word subline and a note under the buttons; an intro line under three section headings; 15–20-word card bodies; benefits that restated the hero and the steps; six FAQ answers of 15–30 words; a closing body line.
- **How it works.** Eyebrow, 40-word intro, long table cells, two code blocks shown in full, 15–20-word gateway steps, a CTA body line.
- **App.** An intro paragraph under every page title (passes, console, composer, gateway); the testnet line on the buy panel *and* in the wallet prompt; "Operator wallet" repeated under the console's wallet chip; a 30-line access tape; an unpaged holders table with a "Bought" column; catalogue cards repeating each gate's location; long hints in the demo controls.

## 2. What changed

No feature or flow was removed.

### Shell
- **Footer:** removed the testnet line (it stays in the wallet prompt, once per transaction) and the duplicate "Photos from Unsplash, see credits" link (Credits is in the footer links).
- **Demo bar (`/app`):** one bar with the section tabs and "Demo controls". The separate "Demo · simulated data" badge is gone; the footer carries it.
- **Marketing pages:** one top bar, the GatePay header, unchanged.

### Home (six sections → five)
- Hero: removed the eyebrow and the note under the buttons; subline 33 → 18 words.
- Three ways: removed the intro line; card bodies 14–18 → 5–9 words (the stub header already shows term and price).
- From payment to open door: removed the intro line; step lines 10–15 → 5–7 words.
- Where gates live: removed the intro line.
- **Removed** the "What changes for you" band: its three outcomes restated the hero ("pay once"), step 4 ("it locks again") and the three ways.
- FAQ: 6 → 4 questions, answers ≤ 15 words. "Can a pass be shared?" is covered by "Transferable passes" on `/how-it-works`; "Is any of this real money?" by the footer and wallet prompt notices.
- Closing: heading + button, no body line.

### How it works
- Removed the eyebrow; intro 40 → 12 words.
- Lifecycle step lines cut to 5–6 words; rule intro and table cells cut; records intro and renewal note one line each.
- The contract events and the webhook payload sit behind "Show the contract events" / "Show the webhook payload" disclosures.
- Gateway steps 10–17 → 5–7 words; extensions cut to 4–8 words; CTA is heading + button.

### Credits and 404
- Credits intro 22 → 8 words; removed the "incubated by Monark" line (the footer carries "Built with Monark").
- 404 body: one line.

### App (`/app/...`)
- **No intro paragraphs.** Passes, console and composer keep the seat eyebrow and the title. The gateway's explanation moved into an info tip next to its title ("What is the gateway?"), new component `src/components/ui/info-tip.tsx` (a popover that opens on click or tap).
- **Testnet line once per transaction:** removed from the buy panel; only the wallet prompt shows it.
- Wallet gate: line 13 → 6 words. Connect prompt: 15 → 8 words.
- Passes: catalogue cards no longer repeat the gate's location (it is on the gate page). "No passes" empty state: one line.
- Gate page: activity tape shows 5 lines + "Show more" (was 7, cut off). "Pass recorded. The gate is open for you." → "The gate is open for you." (the stub is punched and the plate reads OPEN). Paused note shortened.
- Console: removed "Operator wallet" under the chip (the seat eyebrow says it); gate rows show the short price ("12 tUSDC per hour") instead of the full rule sentence; holders table drops the "Bought" column and pages 5 rows at a time.
- Gateway: tape shows 8 events + "Show more" (was 30); "Recent codes at this gate" → "Recent codes".
- Demo controls: hints cut to 4–6 words; reset confirmation 12 → 6 words.
- Composer: webhook hint 8 → 5 words.

French was rewritten to the same brevity in `src/i18n/dictionaries/fr.ts`; EN and FR keys are identical (typed dictionary). Unused keys were removed (`home.eyebrow`, `heroNote`, section intros, `benefits`, `closing.body`, `how.eyebrow`, `how.cta.body`, `credits.built`, `common.footer.photos`, `app.passes.intro`, `app.console.intro`, `app.composer.intro`, `app.wallet.operatorRole`, `console.columns.bought`); `common.showMore`, `how.records.show`, `how.gateway.show`, `app.gateway.about` and `aboutLabel` were added. `/pricing` (internal, unlinked) is unchanged.

## 3. After

| Page | Visible before | Visible after | Change | Total before | Total after | Chrome before | Chrome after |
|-|-:|-:|-:|-:|-:|-:|-:|
| Home | 486 | 256 | −47% | 487 | 254 | 57 | 44 |
| How it works | 496 | 235 | −53% | 502 | 348 | 57 | 44 |
| Credits | 99 | 75 | −24% | 99 | 75 | 57 | 44 |
| 404 | 31 | 22 | −29% | 30 | 21 | 57 | 44 |
| App: wallet gate | 173 | 116 | −33% | 176 | 119 | 57 | 44 |
| App: passes | 237 | 187 | −21% | 240 | 190 | 58 | 45 |
| App: gate (Studio B) | 178 | 152 | −15% | 242 | 201 | 58 | 45 |
| App: console | 253 | 178 | −30% | 256 | 181 | 58 | 45 |
| App: publish a gate | 137 | 117 | −15% | 140 | 120 | 58 | 45 |
| App: gateway | 474 | 162 | −66% | 481 | 165 | 58 | 45 |
| **Total** | **2,564** | **1,500** | **−41%** | **2,653** | **1,674** | **575** | **445** |

Marketing pages alone (home, how it works, credits, 404): 1,112 → 588 visible words (−47%). The app words left are mostly seeded data (gate titles and descriptions, tape lines, amounts, pass codes) and form labels.

Dictionary copy: **EN 2,990 → 2,411 (−19%)**, **FR 3,233 → 2,604 (−19%)**. Per section (EN): common 66 → 63 · home 598 → 299 · how 430 → 276 · credits 49 → 28 · notFound 32 → 23 · app 1,096 → 1,003 · pricing 245 and seed 369 unchanged (internal page and demo data).

### Screenshots

- Before: `docs/screenshots/before/en-1440-light-page-home.png`, `docs/screenshots/before/en-1440-light-flow2-01-gate-2-hours.png`.
- After: `docs/screenshots/en-1440-light-page-home.png`, `docs/screenshots/en-1440-light-flow2-01-gate-2-hours.png`, and every other page and flow step in `docs/screenshots/` (EN 390/1440 light/dark, FR 390/1440 light). File names are unchanged, so the project image did not need re-rendering.
