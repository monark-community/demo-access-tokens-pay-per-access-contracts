import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { HeroGate } from "@/components/home/hero-gate"
import { KindIcon } from "@/components/pass/kind-icon"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { href, isLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n"
import type { GateKind } from "@/lib/demo/types"
import { pageMetadata } from "@/lib/metadata"
import { PHOTOS } from "@/lib/photos"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const d = getDictionary(locale).meta
  return pageMetadata(locale, "/", null, d.description)
}

const PLACES: { key: "room" | "stream" | "video" | "locker"; photo: string; gate: string; kind: GateKind }[] = [
  { key: "room", photo: "studio", gate: "studio-b", kind: "room" },
  { key: "stream", photo: "stream", gate: "rooftop-session", kind: "stream" },
  { key: "video", photo: "pottery", gate: "kiln-course", kind: "video" },
  { key: "locker", photo: "lockers", gate: "locker-14", kind: "locker" },
]

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  const h = d.home

  const ways = [
    { key: "time" as const, kind: "stream" as GateKind, data: h.ways.time },
    { key: "uses" as const, kind: "locker" as GateKind, data: h.ways.uses },
    { key: "forever" as const, kind: "document" as GateKind, data: h.ways.forever },
  ]

  return (
    <>
      {/* Hero ------------------------------------------------------------ */}
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 md:pt-20 md:pb-24 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <h1 className="text-[2.5rem] leading-[1.02] font-extrabold tracking-[-0.035em] sm:text-6xl lg:text-[4.1rem]">
              {h.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{h.sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href={href(locale, "/app")}>
                  {h.ctaPrimary}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={href(locale, "/how-it-works")}>{h.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
          <HeroGate dict={d} />
        </div>
      </section>

      {/* Three ways ------------------------------------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24" aria-labelledby="ways">
        <div className="max-w-2xl">
          <h2 id="ways" className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
            {h.ways.title}
          </h2>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {ways.map((w, i) => (
            <li key={w.key} className="flex flex-col rounded-lg border bg-card">
              <div className="flex items-center justify-between gap-3 rounded-t-lg bg-stub px-5 py-4 text-stub-foreground">
                <span className="label-mono flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full border border-stub-foreground/50 text-[0.7rem]">{i + 1}</span>
                  {w.data.name}
                </span>
                <span className="font-mono text-sm font-semibold">{w.data.term}</span>
              </div>
              <div className="perforation-x mx-5" />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="flex items-center gap-2 font-bold">
                  <KindIcon kind={w.kind} className="size-4 text-primary" />
                  {w.data.example}
                </p>
                <p className="text-muted-foreground">{w.data.body}</p>
                <p className="mt-auto pt-2 font-mono text-sm font-semibold">{w.data.price}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* From payment to open door ---------------------------------------- */}
      <section className="border-y bg-card" aria-labelledby="steps">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="max-w-2xl">
            <h2 id="steps" className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
              {h.steps.title}
            </h2>
          </div>
          <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
            <span aria-hidden="true" className="perforation-x absolute top-5 right-[12%] left-[12%] hidden md:block" />
            {h.steps.items.map((s, i) => (
              <li key={s.title} className="relative">
                <span
                  className={cn(
                    "relative grid size-10 place-items-center rounded-full border-2 font-mono text-sm font-semibold",
                    i === 3 ? "border-rust bg-card text-rust" : i === 2 ? "border-primary bg-primary text-primary-foreground" : "border-foreground bg-card"
                  )}
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Where gates live ------------------------------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24" aria-labelledby="places">
        <div className="max-w-2xl">
          <h2 id="places" className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
            {h.places.title}
          </h2>
        </div>
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
                    <p className="font-bold leading-snug">{h.places.items[p.key]}</p>
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <span className="sr-only">{h.places.open}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* FAQ ---------------------------------------------------------------- */}
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.6fr] md:py-24" aria-labelledby="faq">
        <h2 id="faq" className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
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

      {/* Closing ------------------------------------------------------------ */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="ticket flex flex-col items-start gap-6 rounded-lg bg-stub px-6 py-10 text-stub-foreground sm:px-12 md:flex-row md:items-center md:justify-between" style={{ ["--notch" as string]: "14px" }}>
          <h2 className="max-w-xl text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">{h.closing.title}</h2>
          <Button asChild size="lg">
            <Link href={href(locale, "/app/gate/studio-b")}>
              {h.closing.cta}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
