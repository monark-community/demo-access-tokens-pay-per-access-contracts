"use client"

import { KeyRound, ScanLine, Store } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { href } from "@/i18n/config"
import { useStorageOk } from "@/lib/demo/store"
import { cn } from "@/lib/utils"

import { useApp } from "./app-provider"
import { DemoControls } from "./demo-controls"

/** Demo chrome: one bar with the section tabs (bottom bar on phones) and demo controls. */
export function AppFrame({ children }: { children: ReactNode }) {
  const { dict, locale } = useApp()
  const n = dict.app.nav
  const pathname = usePathname() ?? ""
  const storageOk = useStorageOk()
  const base = href(locale, "/app")
  const tabs = [
    { href: base, label: n.keys, icon: KeyRound, active: pathname === base || pathname.startsWith(`${base}/gate/`) },
    { href: `${base}/console`, label: n.console, icon: Store, active: pathname.startsWith(`${base}/console`) },
    { href: `${base}/gateway`, label: n.gateway, icon: ScanLine, active: pathname.startsWith(`${base}/gateway`) },
  ]

  return (
    <div data-app-frame className="flex flex-1 flex-col">
      <div className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <nav aria-label={n.label} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {tabs.map((tab) => (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    aria-current={tab.active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none",
                      tab.active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <tab.icon className="size-4" aria-hidden="true" />
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <DemoControls className="ml-auto" />
        </div>
        {!storageOk && (
          <p className="border-t bg-muted px-4 py-2 text-center text-xs text-muted-foreground">{dict.app.controls.storageOff}</p>
        )}
      </div>

      <div className="flex flex-1 flex-col">{children}</div>

      <nav
        aria-label={n.label}
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid grid-cols-3">
          {tabs.map((tab) => (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={tab.active ? "page" : undefined}
                className={cn(
                  "relative flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold focus-visible:bg-muted focus-visible:outline-none",
                  tab.active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {tab.active && <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] rounded-b-sm bg-primary" />}
                <tab.icon className="size-5" aria-hidden="true" />
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
