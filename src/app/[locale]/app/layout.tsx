import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AppFrame } from "@/components/demo/app-frame"
import { AppProvider } from "@/components/demo/app-provider"
import { isLocale } from "@/i18n/config"
import { appDict } from "@/i18n/dictionaries/en"
import { getDictionary } from "@/i18n"
import { pageMetadata } from "@/lib/metadata"

export async function generateMetadata({ params }: LayoutProps<"/[locale]/app">): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const a = getDictionary(locale).app
  return pageMetadata(locale, "/app", a.metaTitle, a.metaDescription)
}

export default async function AppLayout({ children, params }: LayoutProps<"/[locale]/app">) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <AppProvider dict={appDict(getDictionary(locale))} locale={locale}>
      <AppFrame>{children}</AppFrame>
    </AppProvider>
  )
}
