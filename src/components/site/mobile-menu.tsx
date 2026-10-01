"use client"

import { MenuIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { NavLinks, type NavItem } from "./nav-links"

/** Full-height sheet with the links, the switches and the action. Closes on navigation. */
export function MobileMenu({
  items,
  openLabel,
  closeLabel,
  title,
  switches,
  action,
  footnote,
}: {
  items: NavItem[]
  openLabel: string
  closeLabel: string
  title: string
  switches: ReactNode
  action: ReactNode
  footnote: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={openLabel} className="md:hidden">
          <MenuIcon className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" closeLabel={closeLabel} className="w-full max-w-none p-0 data-[side=right]:w-full sm:data-[side=right]:max-w-sm">
        <div className="flex h-16 items-center border-b px-4">
          <SheetTitle className="text-base font-bold">{title}</SheetTitle>
          <SheetDescription className="sr-only">{footnote}</SheetDescription>
        </div>
        <nav className="px-3 py-2" aria-label={title}>
          <NavLinks items={items} vertical />
        </nav>
        <div className="flex items-center gap-2 px-4">{switches}</div>
        <div className="px-4 pt-2">{action}</div>
        <p className="mt-auto border-t px-4 py-4 font-mono text-xs text-muted-foreground">{footnote}</p>
      </SheetContent>
    </Sheet>
  )
}
