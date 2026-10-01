import Link from "next/link"

import { href, type Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n"

import { HeaderAction } from "./header-action"
import { LocaleSwitch } from "./locale-switch"
import { Logo } from "./logo"
import { MobileMenu } from "./mobile-menu"
import { NavLinks } from "./nav-links"
import { ThemeToggle } from "./theme"

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.common
  const items = [
    { href: href(locale, "/app"), label: c.nav.demo },
    { href: href(locale, "/how-it-works"), label: c.nav.how },
  ]
  const switches = (
    <>
      <LocaleSwitch locale={locale} label={c.language} names={c.languageNames} />
      <ThemeToggle label={c.toggleTheme} />
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href={href(locale)}
          className="-ml-1 rounded-md p-1 focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none"
          aria-label={`GatePay · ${c.home}`}
        >
          <Logo />
        </Link>
        <nav aria-label={c.primaryNav} className="ml-4 hidden md:block">
          <NavLinks items={items} />
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {switches}
          <HeaderAction demoHref={href(locale, "/app")} label={c.tryDemo} wallet={dict.app.wallet} className="ml-2" />
        </div>
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <MobileMenu
            items={items}
            openLabel={c.openMenu}
            closeLabel={c.closeMenu}
            title={c.menu}
            switches={switches}
            action={<HeaderAction demoHref={href(locale, "/app")} label={c.tryDemo} wallet={dict.app.wallet} className="w-full" />}
            footnote={c.demoBadge}
          />
        </div>
      </div>
    </header>
  )
}
