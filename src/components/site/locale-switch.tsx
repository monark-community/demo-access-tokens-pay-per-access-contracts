"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { locales, switchLocalePath, type Locale } from "@/i18n/config"
import { cn } from "@/lib/utils"

/** Compact EN/FR switch that keeps the current page. */
export function LocaleSwitch({
  locale,
  label,
  names,
  className,
}: {
  locale: Locale
  label: string
  names: Record<Locale, string>
  className?: string
}) {
  const pathname = usePathname() ?? `/${locale}`
  return (
    <nav aria-label={label} className={cn("flex items-center rounded-md border border-foreground/15 p-0.5", className)}>
      {locales.map((l) => (
        <Link
          key={l}
          href={switchLocalePath(pathname, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          aria-label={names[l]}
          className={cn(
            "grid h-8 min-w-9 place-items-center rounded-[4px] px-2 font-mono text-xs font-semibold uppercase transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none",
            l === locale ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l}
        </Link>
      ))}
    </nav>
  )
}
