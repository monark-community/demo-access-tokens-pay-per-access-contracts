import Link from "next/link"
import { locale as rootLocale } from "next/root-params"

import { Door } from "@/components/diagrams/door"
import { Plate } from "@/components/key/plate"
import { Button } from "@/components/ui/button"
import { href, isLocale, type Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n"

async function currentLocale(): Promise<Locale> {
  const value = await rootLocale()
  return value && isLocale(value) ? value : "en"
}

export async function generateMetadata() {
  const locale = await currentLocale()
  return { title: getDictionary(locale).notFound.metaTitle }
}

export default async function NotFound() {
  const locale = await currentLocale()
  const d = getDictionary(locale)
  const n = d.notFound
  return (
    <section className="mx-auto grid w-full max-w-4xl flex-1 items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[220px_1fr]">
      <div className="relative mx-auto w-40 md:w-full">
        <Door />
        <Plate state="locked" label={d.app.plate.locked} className="absolute -top-3 left-1/2 -translate-x-1/2" />
      </div>
      <div>
        <p className="label-mono text-muted-foreground">{n.code}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">{n.title}</h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">{n.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={href(locale)}>{n.home}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={href(locale, "/app")}>{n.demo}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
