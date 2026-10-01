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
    open: "Open the door",
    plusDay: "+1 day",
    passes: "Passes",
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
    open: "Ouvrir la porte",
    plusDay: "+1 jour",
    passes: "Laissez-passer",
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
  await page.screenshot({ path: `${OUT}${v.locale}-${v.w}-${v.theme}-${name}.png`, fullPage })
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
  await page.getByRole("heading", { level: 2, name: v.locale === "fr" ? "Vos laissez-passer" : "Your passes" }).waitFor()
  await page.waitForTimeout(1500)
  if (capture) await shot(page, v, "flow1-04-passes", true)
}

async function toggleFail(page, v) {
  const t = L[v.locale]
  await page.getByRole("button", { name: t.controls }).click()
  await dialog(page).getByLabel(t.fail).click()
  await page.keyboard.press("Escape")
  await page.waitForTimeout(300)
}

async function buyStudio(page, v, withFailure) {
  const t = L[v.locale]
  await go(page, v, "/app/gate/studio-b")
  await page.getByRole("button", { name: t.more, exact: true }).click()
  await page.waitForTimeout(200)
  await shot(page, v, "flow2-01-gate-2-hours", true)
  if (withFailure) await toggleFail(page, v)
  const pay = page.getByRole("button", { name: /^(Pay|Payer) 24/ })
  await pay.click()
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
  await page.locator("[data-slot=tx-status][data-status=confirmed]").waitFor({ timeout: 10000 })
  await page.waitForTimeout(700)
  await page.evaluate(() => window.scrollTo(0, 0))
  await shot(page, v, "flow2-05-confirmed")
  if (v.w < 768) await shot(page, v, "flow2-05-confirmed-full", true)
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
  await buyStudio(page, v, true)

  // Flow 3a: use the pass — the door opens.
  const openBtn = page.getByRole("button", { name: t.open })
  await center(openBtn)
  await openBtn.click()
  await page.getByText(/Door unlocked/).waitFor({ timeout: 8000 })
  await page.waitForTimeout(500)
  await center(page.getByText(/Door unlocked/))
  await shot(page, v, "flow3-01-door-open")

  // Flow 2 failure: not enough balance for 4 more hours.
  await page.getByRole("button", { name: "Renew" }).first().click()
  const more = page.getByRole("button", { name: t.more, exact: true })
  for (let i = 0; i < 3; i++) await more.click()
  await page.getByText(/Not enough tUSDC/).waitFor()
  await center(page.getByText(/Not enough tUSDC/))
  await shot(page, v, "flow2-06-insufficient")

  // Flow 5: the gateway — a granted and a refused check, and the tape.
  await go(page, v, "/app/gateway")
  await page.getByLabel("Pass code").fill("GP-4K7Q-2M")
  await page.getByRole("button", { name: "Check pass" }).click()
  await page.getByText("Access granted").waitFor({ timeout: 8000 })
  await shot(page, v, "flow5-01-granted", v.w >= 768)
  const expired = page.getByRole("button", { name: "GP-ZMWP-KM" })
  await expired.click()
  await page.getByRole("button", { name: "Check pass" }).click()
  await page.getByText("Access denied").waitFor({ timeout: 8000 })
  await center(page.getByText("Access denied"))
  await shot(page, v, "flow5-02-denied")
  await page.getByRole("heading", { name: "Access tape" }).scrollIntoViewIfNeeded()
  await shot(page, v, "flow5-03-tape")

  // Flow 3b: stream playback on a live pass.
  await go(page, v, "/app/gate/rooftop-session")
  await page.getByRole("button", { name: "Play the stream" }).click()
  await page.getByText("Live", { exact: true }).waitFor({ timeout: 8000 })
  await page.waitForTimeout(1200)
  await shot(page, v, "flow3-02-stream-playing", v.w >= 768)

  // Flow 3c: fast-forward a day; the studio pass expires and the door refuses it.
  await page.getByRole("button", { name: t.controls }).click()
  await dialog(page).getByRole("button", { name: t.plusDay }).click()
  await page.waitForTimeout(300)
  await shot(page, v, "app-demo-controls")
  await page.keyboard.press("Escape")
  await go(page, v, "/app/gate/studio-b")
  await page.waitForTimeout(600)
  const open2 = page.getByRole("button", { name: t.open })
  await open2.click()
  await page.getByText(/Pass expired/).waitFor({ timeout: 8000 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await shot(page, v, "flow3-03-expired-denied", true)

  // Metered pass: locker with uses left, board post.
  await go(page, v, "/app/gate/locker-14")
  await page.getByRole("button", { name: "Open the locker" }).click()
  await page.getByText(/Locker open/).waitFor({ timeout: 8000 })
  await page.waitForTimeout(500)
  await shot(page, v, "flow3-04-locker-open", true)

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
  await page.getByLabel("Webhook URL").fill("https://hooks.harbourstreet.works/studio-c/unlock")
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

async function frenchFlow(page, v) {
  await go(page, v, "")
  await page.waitForTimeout(400)
  await shot(page, v, "page-home", true)
  await connect(page, v, false)
  await shot(page, v, "flow1-04-passes", true)
  await buyStudio(page, v, false)
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
    }
  } catch (e) {
    console.error("  ✗", tag, e.message)
    await page.screenshot({ path: `${OUT}_error-${tag}.png` }).catch(() => {})
    process.exitCode = 1
  }
  await context.close()
}
await browser.close()
