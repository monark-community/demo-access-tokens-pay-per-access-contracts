import { ArrowRight, Cable, ChevronDown, Code2, CornerDownLeft, Grid3x3, LockKeyhole, Nfc, Webhook } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { href, isLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n"
import { pageMetadata } from "@/lib/metadata"
import { PHOTOS } from "@/lib/photos"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params }: PageProps<"/[locale]/how-it-works">): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const h = getDictionary(locale).how
  return pageMetadata(locale, "/how-it-works", h.metaTitle, h.metaDescription)
}

const EVENTS = `event KeyPurchased(
  uint256 indexed tokenId,
  bytes32 indexed gateId,
  address indexed holder,
  uint64  start,
  uint64  end,        // 0 for metered and forever keys
  uint32  uses,       // 0 for time and forever keys
  uint256 paid
);

event KeyUsed(uint256 indexed tokenId, uint32 usesLeft);
event KeyRenewed(uint256 indexed tokenId, uint64 end, uint32 uses, uint256 paid);

function accessOf(uint256 tokenId)
  external view
  returns (bytes32 gateId, address holder, uint64 end, uint32 usesLeft, bool forever);`

const PAYLOAD = `POST https://gates.harbourview-parks.example/riverside-2/unlock
X-GatePay-Signature: t=1759152131,v1=6f0c…e41a

{
  "event": "gate.unlock",
  "gate": "riverside-court",
  "key": "GP-4K7Q-2M",
  "holder": "0x5ae1…c3B9",
  "validUntil": "2026-09-29T16:02:11Z",
  "block": 6512344,
  "pin": "482913",
  "holdOpenSeconds": 10
}`

const SDK = `import { GatePay } from "@gatepay/sdk"

const gatepay = new GatePay({ chain: "base-sepolia" })

// Checks the visitor's key on-chain, then reveals the content.
const access = await gatepay.unlock("rooftop-session", { wallet })
if (access.ok) player.play(access.stream)`

const PHYSICAL_ICONS = [LockKeyhole, Grid3x3, Nfc, Cable]
const DIGITAL_ICONS = [Code2, Webhook]

// One hue: the steps that touch the key are aquamarine, the rest ink; expiry is dimmed.
const TONES = ["border-foreground", "border-primary", "border-primary", "border-foreground", "border-primary", "border-muted-foreground"]

export default async function HowItWorksPage({ params }: PageProps<"/[locale]/how-it-works">) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  const h = d.how

  return (
    <>
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-14 sm:px-6 md:pt-16">
          <h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl">{h.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{h.intro}</p>
        </div>
      </section>

      {/* Lifecycle ---------------------------------------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="lifecycle">
        <h2 id="lifecycle" className="text-2xl font-extrabold sm:text-3xl">
          {h.lifecycle.title}
        </h2>
        <figure className="mt-8" aria-label={h.lifecycle.aria}>
          <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:gap-0">
            {h.lifecycle.steps.map((s, i) => (
              <li key={s.label} className="relative flex lg:flex-col">
                <div className={cn("flex-1 rounded-md border-2 bg-card p-4 lg:mr-5 lg:min-h-40", TONES[i])}>
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  <p className="mt-1 font-bold">{s.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
                {i < h.lifecycle.steps.length - 1 && (
                  <ArrowRight aria-hidden="true" className="absolute top-1/2 right-0 hidden size-4 -translate-y-1/2 text-muted-foreground lg:block" />
                )}
              </li>
            ))}
          </ol>
          <div className="mt-3 hidden items-center gap-2 lg:flex" aria-hidden="true">
            <span className="ml-[calc(100%/12)] h-6 flex-1 rounded-b-md border-x-2 border-b-2 border-dashed border-muted-foreground/70" />
          </div>
          <p className="mt-2 flex items-center gap-2 font-mono text-xs text-muted-foreground lg:justify-center">
            <CornerDownLeft className="size-3.5" aria-hidden="true" />
            {h.lifecycle.renew}: {h.lifecycle.steps[5]?.label} → {h.lifecycle.steps[1]?.label}
          </p>
        </figure>
      </section>

      {/* The rule ------------------------------------------------------------ */}
      <section className="border-y bg-card" aria-labelledby="rule">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="rule" className="text-2xl font-extrabold sm:text-3xl">
              {h.rule.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{h.rule.intro}</p>
          </div>
          <div className="min-w-0 overflow-x-auto rounded-md border bg-background">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th scope="col" className="label-mono px-4 py-3 font-medium text-muted-foreground">
                    {h.rule.headers.field}
                  </th>
                  <th scope="col" className="label-mono px-4 py-3 font-medium text-muted-foreground">
                    {h.rule.headers.meaning}
                  </th>
                  <th scope="col" className="label-mono px-4 py-3 font-medium text-muted-foreground">
                    {h.rule.headers.example}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed">
                {h.rule.rows.map((r) => (
                  <tr key={r.field}>
                    <th scope="row" className="px-4 py-2.5 text-left font-mono text-xs font-semibold">
                      {r.field}
                    </th>
                    <td className="px-4 py-2.5">{r.meaning}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-primary">{r.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contract events ----------------------------------------------------- */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="records">
        <div>
          <h2 id="records" className="text-2xl font-extrabold sm:text-3xl">
            {h.records.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{h.records.intro}</p>
          <p className="mt-4 rounded-md bg-key p-3 text-sm text-key-foreground">{h.records.note}</p>
        </div>
        <Disclosure label={h.records.show}>
          <pre className="overflow-x-auto rounded-md bg-plate p-5 font-mono text-[0.78rem] leading-relaxed text-plate-foreground" tabIndex={0}>
            <code>{EVENTS}</code>
          </pre>
        </Disclosure>
      </section>

      {/* Gateway ------------------------------------------------------------ */}
      <section className="border-y bg-card" aria-labelledby="gateway">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="gateway" className="text-2xl font-extrabold sm:text-3xl">
              {h.gateway.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{h.gateway.intro}</p>
            <ol className="mt-5 space-y-3">
              {h.gateway.steps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border font-mono text-xs">{i + 1}</span>
                  <span className="text-[0.95rem]">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <Disclosure label={h.gateway.show}>
            <h3 className="label-mono text-muted-foreground">{h.gateway.payloadTitle}</h3>
            <pre className="mt-3 overflow-x-auto rounded-md bg-plate p-5 font-mono text-[0.78rem] leading-relaxed text-plate-foreground" tabIndex={0}>
              <code>{PAYLOAD}</code>
            </pre>
            <p className="mt-3 text-sm text-muted-foreground">{h.gateway.payloadNote}</p>
          </Disclosure>
        </div>
      </section>

      {/* Integrations ----------------------------------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="integrations">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="integrations" className="text-2xl font-extrabold sm:text-3xl">
              {h.integrations.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{h.integrations.intro}</p>
            <div className="relative mt-6 hidden aspect-[3/4] max-w-xs overflow-hidden rounded-lg border lg:block">
              <Image src={PHOTOS.smartLock!.src} alt={PHOTOS.smartLock!.alt[locale]} fill placeholder="blur" sizes="320px" className="object-cover" />
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8">
            {(
              [
                [h.integrations.physicalTitle, h.integrations.physical, PHYSICAL_ICONS],
                [h.integrations.digitalTitle, h.integrations.digital, DIGITAL_ICONS],
              ] as const
            ).map(([title, items, icons]) => (
              <div key={title}>
                <h3 className="label-mono text-muted-foreground">{title}</h3>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {items.map((item, i) => {
                    const Icon = icons[i] ?? Cable
                    return (
                      <li key={item.name} className="flex gap-3 rounded-lg border bg-card p-4">
                        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-key text-key-foreground">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground">{item.body}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="label-mono text-muted-foreground">{h.integrations.sdkTitle}</h3>
              <pre className="mt-3 overflow-x-auto rounded-md bg-plate p-5 font-mono text-[0.78rem] leading-relaxed text-plate-foreground" tabIndex={0}>
                <code>{SDK}</code>
              </pre>
              <p className="mt-3 text-sm text-muted-foreground">{h.integrations.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Extensions + CTA --------------------------------------------------- */}
      <section className="mx-auto grid w-full max-w-6xl gap-10 border-t px-4 py-14 sm:px-6 lg:grid-cols-2" aria-labelledby="next">
        <div>
          <h2 id="next" className="text-2xl font-extrabold sm:text-3xl">
            {h.extensions.title}
          </h2>
          <ul className="mt-5 space-y-3">
            {h.extensions.items.map((x) => (
              <li key={x} className="flex gap-3 border-b border-dashed pb-3">
                <span aria-hidden="true" className="font-mono text-primary">
                  +
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid-bg self-start rounded-xl border bg-key p-8 text-key-foreground">
          <h2 className="text-2xl font-extrabold">{h.cta.title}</h2>
          <Button asChild size="lg" className="mt-6">
            <Link href={href(locale, "/app")}>
              {h.cta.button}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}

/** Code on demand: a native disclosure, closed by default. */
function Disclosure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group min-w-0 self-start">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md border bg-card px-4 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}
