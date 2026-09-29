import { GateView } from "@/components/demo/gate-view"
import { locales } from "@/i18n/config"

const SEEDED = ["studio-b", "rooftop-session", "kiln-course", "locker-14", "lowwater-report", "notice-board"]

/** Seeded gates are prerendered; gates published in the demo render on demand. */
export function generateStaticParams() {
  return locales.flatMap((locale) => SEEDED.map((id) => ({ locale, id })))
}

export default async function GatePage({ params }: PageProps<"/[locale]/app/gate/[id]">) {
  const { id } = await params
  return <GateView id={decodeURIComponent(id)} />
}
