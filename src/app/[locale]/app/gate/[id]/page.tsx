import { GateView } from "@/components/demo/gate-view"
import { locales } from "@/i18n/config"
import { getDictionary } from "@/i18n"

/** Every seeded gate has copy in the dictionary, so that list is the seed's. */
const SEEDED = Object.keys(getDictionary("en").seed.gates)

/** Seeded gates are prerendered; gates published in the demo render on demand. */
export function generateStaticParams() {
  return locales.flatMap((locale) => SEEDED.map((id) => ({ locale, id })))
}

export default async function GatePage({ params }: PageProps<"/[locale]/app/gate/[id]">) {
  const { id } = await params
  return <GateView id={decodeURIComponent(id)} />
}
