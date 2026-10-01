import { Check } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { isLocale } from "@/i18n/config"
import { getDictionary, t } from "@/i18n"
import { cn } from "@/lib/utils"

/**
 * INTERNAL strategy review only. Never linked from anywhere, excluded from the
 * sitemap, and marked noindex/nofollow.
 */
export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return {
    title: getDictionary(locale).pricing.metaTitle,
    robots: { index: false, follow: false },
  }
}

export default async function PricingPage({ params }: PageProps<"/[locale]/pricing">) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const p = getDictionary(locale).pricing

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <p className="inline-flex rounded-full border border-dashed border-primary px-3 py-1 font-mono text-xs text-primary">{p.internal}</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl">{p.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{p.intro}</p>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {p.plans.map((plan, i) => (
          <li key={plan.name} className={cn("flex flex-col rounded-lg border bg-card", i === 1 && "border-2 border-primary")}>
            <div className="border-b border-dashed p-5">
              <p className="label-mono text-muted-foreground">{plan.for}</p>
              <h2 className="mt-2 text-2xl font-extrabold">{plan.name}</h2>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-semibold">{plan.price}</span>
                {plan.price.match(/\d/) && <span className="text-sm text-muted-foreground">{p.perMonth}</span>}
              </p>
              <p className="mt-1 font-mono text-sm text-primary">{t(p.fee, { fee: plan.fee })}</p>
            </div>
            <ul className="flex-1 space-y-2.5 p-5 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <section className="mt-14" aria-labelledby="math">
        <h2 id="math" className="text-2xl font-extrabold tracking-[-0.02em]">
          {p.mathTitle}
        </h2>
        <div className="mt-4 overflow-x-auto rounded-md border bg-card">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b text-left">
                {[p.mathHeaders.sale, p.mathHeaders.open, p.mathHeaders.venue, p.mathHeaders.card].map((h) => (
                  <th key={h} scope="col" className="label-mono px-4 py-3 font-medium text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed">
              {p.mathRows.map((r) => (
                <tr key={r.sale}>
                  <th scope="row" className="px-4 py-2.5 text-left font-semibold">
                    {r.sale}
                  </th>
                  <td className="px-4 py-2.5 font-mono">{r.open}</td>
                  <td className="px-4 py-2.5 font-mono text-primary">{r.venue}</td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{r.card}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14 max-w-3xl" aria-labelledby="why">
        <h2 id="why" className="text-2xl font-extrabold tracking-[-0.02em]">
          {p.why.title}
        </h2>
        <ul className="mt-4 space-y-3">
          {p.why.items.map((x) => (
            <li key={x} className="flex gap-3 border-b border-dashed pb-3">
              <span aria-hidden="true" className="font-mono text-primary">
                —
              </span>
              {x}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
