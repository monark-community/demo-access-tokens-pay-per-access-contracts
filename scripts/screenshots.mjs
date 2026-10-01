// Visual check of every page and key flow with Playwright.
// Usage: pnpm build && pnpm start -p 3144   (in another terminal)
//        pnpm screenshots                   (BASE_URL defaults to http://localhost:3144)
// Output: docs/screenshots/<locale>-<width>-<theme>-<name>.png
import { mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"

const BASE = process.env.BASE_URL ?? "http://localhost:3144"
const OUT = fileURLToPath(new URL("../docs/screenshots/", import.meta.url))
const ONLY = process.env.ONLY

const sizes = { 390: { width: 390, height: 844 }, 1440: { width: 1440, height: 900 } }
const variants = []
for (const w of [390, 1440]) for (const theme of ["light", "dark"]) variants.push({ locale: "en", w, theme })
for (const w of [390, 1440]) variants.push({ locale: "fr", w, theme: "light" })

const L = {
  en: {
    connect: "Connect demo wallet",
    connectOk: "Connect",
    approve: "Approve",
    reject: "Reject",
    more: "More",
    controls: "Demo controls",
    fail: "Fail the next transaction",
    retry: "Try again",
    plusDay: "+1 day",
    yours: "Your keys",
    unlockFor: /^Unlock · /,
    unlock: "Unlock",
    gateOpen: /Gate open/,
  },
  fr: {
    connect: "Connecter le portefeuille de démo",
    connectOk: "Connecter",
    approve: "Approuver",
    reject: "Refuser",
    more: "Plus",
    controls: "Contrôles de démo",
    fail: "Faire échouer la prochaine transaction",
    retry: "Réessayer",
    plusDay: "+1 jour",
    yours: "Vos clés",
    unlockFor: /^Ouvrir · /,
    unlock: "Ouvrir",
    gateOpen: /Grille ouverte/,
  },
}

async function newPage(browser, v) {
  const context = await browser.newContext({
    viewport: sizes[v.w],
    colorScheme: v.theme,
    locale: v.locale === "fr" ? "fr-CA" : "en-CA",
    reducedMotion: "no-preference",
  })
  await context.addInitScript((t) => {
    try {
      window.localStorage.setItem("theme", t)
    } catch {}
  }, v.theme)
  const page = await context.newPage()
  page.on("pageerror", (e) => console.log("  ! pageerror", e.message))
  return { context, page }
}

const shot = async (page, v, name, fullPage = false) => {
  await page.waitForTimeout(350)
  // Finite animations jump to their end: headless Chrome only advances them when a frame is drawn.
  await page.screenshot({ path: `${OUT}${v.locale}-${v.w}-${v.theme}-${name}.png`, fullPage, animations: "disabled" })
  const sw = await page.evaluate(() => document.documentElement.scrollWidth)
  if (sw > v.w) console.log(`  ! horizontal overflow on ${name}: ${sw}px`)
  console.log("  ✓", `${v.locale}-${v.w}-${v.theme}-${name}`)
}

const go = (page, v, path) => page.goto(`${BASE}/${v.locale}${path}`, { waitUntil: "networkidle" })
const dialog = (page) => page.getByRole("dialog")
const center = (loc) => loc.evaluate((el) => el.scrollIntoView({ block: "center" }))

async function connect(page, v, capture) {
  const t = L[v.locale]
  await go(page, v, "/app")
  const btn = page.getByRole("main").getByRole("button", { name: t.connect })
  await btn.waitFor()
  if (capture) await shot(page, v, "flow1-01-wallet-gate", true)
  await btn.click()
  await dialog(page).waitFor()
  if (capture) await shot(page, v, "flow1-02-connect-prompt")
  if (capture) {
    await dialog(page).getByRole("button", { name: t.reject }).click()
    await page.getByRole("alert").first().waitFor()
    await shot(page, v, "flow1-03-connect-rejected")
    await btn.click()
    await dialog(page).waitFor()
  }
  await dialog(page).getByRole("button", { name: t.connectOk, exact: true }).click()
  await page.getByRole("heading", { level: 2, name: t.yours }).waitFor()
  await page.waitForTimeout(1500)
  if (capture) await shot(page, v, "flow1-04-keys", true)
}

async function toggleFail(page, v) {
  const t = L[v.locale]
  await page.getByRole("button", { name: t.controls }).click()
  await dialog(page).getByLabel(t.fail).click()
  await page.keyboard.press("Escape")
  await page.waitForTimeout(300)
}

/** Flow 2: no key yet. Pick 2 hours of the basketball cage, pay, watch the unlock, get the PIN. */
async function unlockCage(page, v, withFailure) {
  const t = L[v.locale]
  await go(page, v, "/app/gate/pine-cage")
  await page.getByRole("button", { name: t.more, exact: true }).click()
  await page.waitForTimeout(200)
  await shot(page, v, "flow2-01-gate", true)
  if (withFailure) await toggleFail(page, v)
  await page.getByRole("button", { name: t.unlockFor }).click()
  await dialog(page).waitFor()
  await shot(page, v, "flow2-02-pay-prompt")
  await dialog(page).getByRole("button", { name: t.approve }).click()
  const status = page.locator("[data-slot=tx-status]").first()
  await status.waitFor()
  await center(status)
  await shot(page, v, "flow2-03-pending")
  if (withFailure) {
    await page.locator("[data-slot=tx-status][data-status=failed]").waitFor({ timeout: 10000 })
    await center(page.locator("[data-slot=tx-status][data-status=failed]"))
    await shot(page, v, "flow2-04-failed")
    await page.getByRole("button", { name: t.retry }).click()
    await dialog(page).getByRole("button", { name: t.approve }).click()
  }
  // Mid-story: the key is minted and goes in.
  await page
    .locator("#unlock-stage")
    .filter({ hasText: /Key in|Clé insérée|Checking|Vérification|Minting|Création/ })
    .waitFor({ timeout: 12000 })
  await center(page.locator("#unlock-title"))
  await shot(page, v, "flow2-05-unlocking")
  await page.getByText(t.gateOpen).first().waitFor({ timeout: 10000 })
  await page.waitForTimeout(700)
  await center(page.locator("#unlock-title"))
  await shot(page, v, "flow2-06-unlocked")
  await page.evaluate(() => window.scrollTo(0, 0))
  await shot(page, v, "flow2-07-unlocked-full", true)
}

async function marketing(page, v) {
  for (const [name, path] of [
    ["home", ""],
    ["how-it-works", "/how-it-works"],
    ["credits", "/credits"],
    ["pricing", "/pricing"],
    ["404", "/this-door-does-not-exist"],
  ]) {
    await go(page, v, path)
    await page.waitForTimeout(400)
    await shot(page, v, `page-${name}`, true)
  }
  if (v.w < 768) {
    await go(page, v, "")
    await page.getByRole("button", { name: "Open menu" }).click()
    await dialog(page).waitFor()
    await shot(page, v, "page-mobile-menu")
  }
}

async function appFlows(page, v) {
  const t = L[v.locale]
  await connect(page, v, true)
  await unlockCage(page, v, true)

  // Flow 3a: a metered key you already hold. One tap spends one entry and opens the court gate.
  await go(page, v, "/app/gate/riverside-court")
  await page.getByRole("button", { name: t.unlock, exact: true }).click()
  await page.getByText(t.gateOpen).first().waitFor({ timeout: 10000 })
  await page.waitForTimeout(600)
  await shot(page, v, "flow3-01-court-open", true)
  // The carousel: next photo.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.getByRole("button", { name: "Next photo" }).click()
  await page.waitForTimeout(700)
  await shot(page, v, "flow3-02-carousel")

  // Flow 3b: a timed digital key: the stream plays.
  await go(page, v, "/app/gate/rooftop-session")
  await page.getByRole("button", { name: t.unlock, exact: true }).click()
  await page.getByText("Live", { exact: true }).waitFor({ timeout: 10000 })
  await page.waitForTimeout(1200)
  await shot(page, v, "flow3-03-stream-playing", true)

  // Flow 3c: a keep-forever key: the report opens.
  await go(page, v, "/app/gate/lowwater-report")
  await page.getByRole("button", { name: t.unlock, exact: true }).click()
  await page.getByText("Full report unlocked").waitFor({ timeout: 10000 })
  await page.waitForTimeout(800)
  await shot(page, v, "flow3-04-report-open", true)

  // Not enough balance: three 2-hour blocks of the baseball diamond.
  await go(page, v, "/app/gate/diamond-3")
  const more = page.getByRole("button", { name: t.more, exact: true })
  for (let i = 0; i < 2; i++) await more.click()
  await page.getByText(/Not enough tUSDC/).waitFor()
  await center(page.getByText(/Not enough tUSDC/))
  await shot(page, v, "flow2-08-insufficient")

  // Flow 5: the gateway: a granted and a refused check, and the tape.
  await go(page, v, "/app/gateway")
  await page.getByLabel("Key code").fill("GP-4K7Q-2M")
  await page.getByRole("button", { name: "Check key" }).click()
  await page.getByText("Access granted").waitFor({ timeout: 8000 })
  await shot(page, v, "flow5-01-granted", v.w >= 768)
  await page.getByLabel("Key code").fill("GP-AAAA-AA")
  await page.getByRole("button", { name: "Check key" }).click()
  await page.getByText("Access denied").waitFor({ timeout: 8000 })
  await center(page.getByText("Access denied"))
  await shot(page, v, "flow5-02-denied")
  await page.getByRole("heading", { name: "Access tape" }).scrollIntoViewIfNeeded()
  await shot(page, v, "flow5-03-tape")

  // Flow 3d: fast-forward a day; the 2-hour cage key has expired and the button offers to renew.
  await page.getByRole("button", { name: t.controls }).click()
  await dialog(page).getByRole("button", { name: t.plusDay }).click()
  await page.waitForTimeout(300)
  await shot(page, v, "app-demo-controls")
  await page.keyboard.press("Escape")
  await go(page, v, "/app/gate/pine-cage")
  await page.getByRole("button", { name: /^Renew & unlock/ }).waitFor({ timeout: 8000 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await shot(page, v, "flow3-05-expired-renew", true)
  await go(page, v, "/app")
  await page.waitForTimeout(800)
  await shot(page, v, "flow3-06-keys-after", true)

  // Flow 4: publish a gate from the console.
  await go(page, v, "/app/console")
  await shot(page, v, "flow4-01-console", true)
  await page.getByRole("link", { name: "New gate" }).click()
  await page.getByRole("heading", { level: 1, name: "Publish a gate" }).waitFor()
  await page.getByLabel("Webhook URL").fill("hooks.example")
  await page.getByRole("button", { name: "Publish gate" }).click()
  await page.waitForTimeout(300)
  await page.evaluate(() => window.scrollTo(0, 0))
  await shot(page, v, "flow4-02-composer-errors", true)
  await page.getByLabel("Title").fill("Studio C · drum room")
  await page.getByLabel("Where or what").fill("Harbour Street Works, 3rd floor")
  await page.getByLabel("Description").fill("Treated room with a five-piece kit, cymbals and two monitors.")
  await page.getByLabel("Price per unit").fill("15")
  await page.getByLabel("Webhook URL").fill("https://hooks.harbourstreet.example/studio-c/unlock")
  await shot(page, v, "flow4-03-composer-filled", true)
  await page.getByRole("button", { name: "Publish gate" }).click()
  await dialog(page).waitFor()
  await shot(page, v, "flow4-04-publish-prompt")
  await dialog(page).getByRole("button", { name: t.approve }).click()
  await page.waitForURL(/\/app\/console$/, { timeout: 15000 })
  await page.getByText("Studio C · drum room").first().waitFor()
  await page.waitForTimeout(400)
  await shot(page, v, "flow4-05-published")
}

/** The unlock with prefers-reduced-motion: same states, no choreography. */
async function reducedMotion(browser, v) {
  const context = await browser.newContext({ viewport: sizes[v.w], colorScheme: v.theme, reducedMotion: "reduce" })
  await context.addInitScript((t) => {
    try {
      window.localStorage.setItem("theme", t)
    } catch {}
  }, v.theme)
  const page = await context.newPage()
  page.on("pageerror", (e) => console.log("  ! pageerror", e.message))
  await connect(page, v, false)
  await go(page, v, "/app/gate/riverside-court")
  await page.getByRole("button", { name: L[v.locale].unlock, exact: true }).click()
  await page.getByText(L[v.locale].gateOpen).first().waitFor({ timeout: 10000 })
  await shot(page, v, "flow3-07-court-open-reduced-motion", true)
  await context.close()
}

async function frenchFlow(page, v) {
  await go(page, v, "")
  await page.waitForTimeout(400)
  await shot(page, v, "page-home", true)
  await connect(page, v, false)
  await shot(page, v, "flow1-04-keys", true)
  await unlockCage(page, v, false)
  await go(page, v, "/app/console")
  await shot(page, v, "flow4-01-console", true)
}

const browser = await chromium.launch()
await mkdir(OUT, { recursive: true })
for (const v of variants) {
  const tag = `${v.locale}-${v.w}-${v.theme}`
  if (ONLY && !tag.includes(ONLY)) continue
  console.log(tag)
  const { context, page } = await newPage(browser, v)
  try {
    if (v.locale === "fr") await frenchFlow(page, v)
    else {
      await marketing(page, v)
      await appFlows(page, v)
      if (v.w === 1440 && v.theme === "light") await reducedMotion(browser, v)
    }
  } catch (e) {
    console.error("  ✗", tag, e.message)
    await page.screenshot({ path: `${OUT}_error-${tag}.png` }).catch(() => {})
    process.exitCode = 1
  }
  await context.close()
}
await browser.close()
