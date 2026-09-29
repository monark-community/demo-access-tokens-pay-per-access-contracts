import Link from "next/link"

import { href, MONARK_URL, PROJECT_DOC_URL, REPO_URL, type Locale } from "@/i18n/config"
import { t, type Dictionary } from "@/i18n"

import { Logo } from "./logo"

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.common
  const f = c.footer
  const year = new Date().getFullYear()
  const link =
    "rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none"

  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">{f.tagline}</p>
        </div>
        <nav aria-label={f.product}>
          <h2 className="label-mono text-muted-foreground">{f.product}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className={link} href={href(locale, "/app")}>
                {c.nav.demo}
              </Link>
            </li>
            <li>
              <Link className={link} href={href(locale, "/how-it-works")}>
                {c.nav.how}
              </Link>
            </li>
            <li>
              <Link className={link} href={href(locale, "/credits")}>
                {c.nav.credits}
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label={f.project}>
          <h2 className="label-mono text-muted-foreground">{f.project}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a className={link} href={PROJECT_DOC_URL}>
                {f.docs}
              </a>
            </li>
            <li>
              <a className={link} href={REPO_URL}>
                {f.github}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-[13px] text-muted-foreground sm:px-6 md:flex-row md:flex-wrap md:items-center md:gap-x-6">
          <span>{t(f.rights, { year })}</span>
          <span className="font-mono text-xs">{c.demoBadge}</span>
          <a className={`${link} md:ml-auto`} href={MONARK_URL}>
            {c.builtWith}
          </a>
        </div>
      </div>
    </footer>
  )
}
