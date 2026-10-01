import { ArrowRight, Cable, Code2, Grid3x3, Infinity as InfinityIcon, LockKeyhole, MonitorPlay, Nfc, Timer, Gauge } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { HeroGate } from "@/components/home/hero-gate"
import { KindIcon } from "@/components/key/kind-icon"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { href, isLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n"
import type { GateKind } from "@/lib/demo/types"
import { pageMetadata } from "@/lib/metadata"
import { PHOTOS } from "@/lib/photos"

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const d = getDictionary(locale).meta
  return pageMetadata(locale, "/", null, d.description)
}

const PLACES: { key: "court" | "diamond" | "room" | "stream"; photo: string; gate: string; kind: GateKind }[] = [
  { key: "court", photo: "tennis", gate: "riverside-court", kind: "court" },
  { key: "diamond", photo: "diamond", gate: "diamond-3", kind: "court" },
  { key: "room", photo: "studio2", gate: "studio-b", kind: "room" },
  { key: "stream", photo: "stream", gate: "rooftop-session", kind: "stream" },
]

const PLUG_ICONS = [LockKeyhole, Grid3x3, Nfc, Cable, Code2]

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  const h = d.home

  return (
    <>
      {/* Hero ------------------------------------------------------------ */}
      <section className="relative overflow-hidden border-b">
        <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 md:pt-20 md:pb-24 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <h1 className="text-[2.4rem] leading-[1.02] font-extrabold tracking-[-0.045em] sm:text-6xl lg:text-[4rem]">{h.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{h.sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href={href(locale, "/app/gate/riverside-court")}>
                  {h.ctaPrimary}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={href(locale, "/how-it-works")}>{h.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
          <HeroGate dict={d} locale={locale} />
        </div>
      </section>

      {/* Three kinds of key: the focal section --------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24" aria-labelledby="keys">
        <h2 id="keys" className="text-3xl font-extrabold sm:text-4xl">
          {h.keys.title}
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          <KeyKind icon={Timer} data={h.keys.time} meter={<TimeBar />} />
          <KeyKind icon={Gauge} data={h.keys.uses} meter={<Segments left={3} total={10} />} />
          <KeyKind icon={InfinityIcon} data={h.keys.forever} meter={<span className="block h-2 rounded-full bg-key-foreground" />} />
        </ul>
      </section>

      {/* Physical or digital ------------------------------------------- */}
      <section className="border-y bg-card" aria-labelledby="split">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h2 id="split" className="max-w-2xl text-3xl font-extrabold sm:text-4xl">
            {h.split.title}
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {(
              [
                ["physical", h.split.physical, "tennisGate"],
                ["digital", h.split.digital, "studio"],
              ] as const
            ).map(([key, s, photoKey]) => {
              const photo = PHOTOS[photoKey]!
              return (
                <div key={key} className="flex flex-col overflow-hidden rounded-lg border bg-background">
                  <div className="relative aspect-[16/9]">
                    <Image src={photo.src} alt={photo.alt[locale]} fill placeholder="blur" sizes="(min-width: 768px) 560px, 92vw" className="object-cover" />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 font-mono text-[0.7rem] font-semibold tracking-[0.1em] uppercase">
                      {key === "physical" ? <LockKeyhole className="size-3.5 text-primary" aria-hidden="true" /> : <MonitorPlay className="size-3.5 text-primary" aria-hidden="true" />}
                      {s.title}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="text-[0.95rem]">{s.body}</p>
                    <ul className="mt-auto flex flex-wrap gap-2">
                      {s.items.map((item) => (
                        <li key={item} className="rounded-full border px-2.5 py-1 font-mono text-xs">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <p className="label-mono shrink-0 text-muted-foreground">{h.split.plugs}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {h.split.plugItems.map((item, i) => {
                const Icon = PLUG_ICONS[i] ?? Cable
                return (
                  <li key={item} className="flex items-center gap-2 text-sm font-semibold">
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Where gates live ------------------------------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24" aria-labelledby="places">
        <h2 id="places" className="text-3xl font-extrabold sm:text-4xl">
          {h.places.title}
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLACES.map((p) => {
            const photo = PHOTOS[p.photo]!
            return (
              <li key={p.key}>
                <Link
                  href={href(locale, `/app/gate/${p.gate}`)}
                  className="group block overflow-hidden rounded-lg border bg-card focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <Image
                      src={photo.src}
                      alt={photo.alt[locale]}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 92vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 text-xs font-semibold">
                      <KindIcon kind={p.kind} className="size-3.5 text-primary" />
                      {d.kinds[p.kind]}
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-3 p-4">
                    <p className="leading-snug font-bold">{h.places.items[p.key]}</p>
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <span className="sr-only">{h.places.open}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* FAQ, then the closing call ------------------------------------- */}
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 sm:px-6 md:grid-cols-[1fr_1.6fr] md:pb-24" aria-labelledby="faq">
        <h2 id="faq" className="text-3xl font-extrabold sm:text-4xl">
          {h.faq.title}
        </h2>
        <Accordion type="single" collapsible className="border-t">
          {h.faq.items.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`} className="border-b">
              <AccordionTrigger className="py-4 text-left text-base font-bold">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-base text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid-bg flex flex-col items-start gap-6 rounded-xl border bg-key px-6 py-10 text-key-foreground sm:px-12 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl text-2xl font-extrabold sm:text-3xl">{h.closing.title}</h2>
          <Button asChild size="lg">
            <Link href={href(locale, "/app/gate/riverside-court")}>
              {h.closing.cta}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}

type KeyCopy = { name: string; body: string; example: string; price: string; term: string }

/** One kind of key, drawn as a key card: name, what it does, a real gate, and its meter. */
function KeyKind({ icon: Icon, data, meter }: { icon: typeof Timer; data: KeyCopy; meter: ReactNode }) {
  return (
    <li className="flex flex-col rounded-xl bg-key p-6 text-key-foreground">
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-lg bg-key-foreground text-key">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="font-mono text-sm font-semibold">{data.term}</span>
      </div>
      <h3 className="mt-6 text-2xl font-extrabold">{data.name}</h3>
      <p className="mt-2 text-[0.95rem]">{data.body}</p>
      <div className="mt-auto pt-8">
        <div aria-hidden="true">{meter}</div>
        <p className="mt-3 flex items-baseline justify-between gap-3 font-mono text-sm">
          <span className="font-semibold">{data.example}</span>
          <span>{data.price}</span>
        </p>
      </div>
    </li>
  )
}

/** A timed key's bar, draining on a loop (still under reduced motion). */
function TimeBar() {
  return (
    <span className="relative block h-2 overflow-hidden rounded-full bg-key-foreground/15">
      <span className="gp-hero-drain absolute inset-0 rounded-full bg-key-foreground" />
    </span>
  )
}

function Segments({ left, total }: { left: number; total: number }) {
  return (
    <span className="flex gap-[3px]">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < left ? "h-2 flex-1 rounded-[2px] bg-key-foreground" : "h-2 flex-1 rounded-[2px] border border-key-foreground/45"} />
      ))}
    </span>
  )
}
