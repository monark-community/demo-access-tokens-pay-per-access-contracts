import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { isLocale, MONARK_URL } from "@/i18n/config"
import { getDictionary, t } from "@/i18n"
import { pageMetadata } from "@/lib/metadata"
import { PHOTOS } from "@/lib/photos"

export async function generateMetadata({ params }: PageProps<"/[locale]/credits">): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const c = getDictionary(locale).credits
  return pageMetadata(locale, "/credits", c.metaTitle, c.metaDescription)
}

export default async function CreditsPage({ params }: PageProps<"/[locale]/credits">) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  const c = d.credits
  const link = "font-semibold underline decoration-1 underline-offset-4 hover:decoration-2"

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      <h1 className="text-4xl font-extrabold tracking-[-0.035em]">{c.title}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{c.intro}</p>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {Object.entries(PHOTOS).map(([key, p]) => (
          <li key={key} className="overflow-hidden rounded-lg border bg-card">
            <div className="relative aspect-[3/2]">
              <Image src={p.src} alt={p.alt[locale]} fill placeholder="blur" sizes="(min-width: 640px) 420px, 92vw" className="object-cover" />
            </div>
            <div className="space-y-1 p-4 text-sm">
              <p>
                <a className={link} href={p.page}>
                  {t(c.photoBy, { name: p.photographer })}
                </a>{" "}
                <a className="text-muted-foreground underline underline-offset-4" href={p.profile}>
                  {c.onUnsplash}
                </a>
              </p>
              <p className="text-muted-foreground">{t(c.usedFor, { use: p.use[locale] })}</p>
              <p className="font-mono text-xs text-muted-foreground">
                <a className="underline underline-offset-4" href="https://unsplash.com/license">
                  {c.license}
                </a>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-muted-foreground">
        {c.built}{" "}
        <a className={link} href={MONARK_URL}>
          {d.common.builtWith}
        </a>
      </p>
    </div>
  )
}
