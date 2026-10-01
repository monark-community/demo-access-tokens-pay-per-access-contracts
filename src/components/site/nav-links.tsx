"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export interface NavItem {
  href: string
  label: string
}

/** Header links with an underline "plate" on the active page. */
export function NavLinks({ items, className, vertical }: { items: NavItem[]; className?: string; vertical?: boolean }) {
  const pathname = usePathname() ?? ""
  return (
    <ul className={cn("flex", vertical ? "flex-col gap-1" : "items-center gap-1", className)}>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative inline-flex items-center rounded-md font-semibold transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none",
                vertical ? "h-12 w-full px-3 text-lg hover:bg-muted" : "h-10 px-3 text-sm hover:text-foreground",
                active ? "text-foreground" : "text-muted-foreground",
                active &&
                  !vertical &&
                  "after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[3px] after:rounded-t-sm after:bg-primary",
                active && vertical && "bg-muted"
              )}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
