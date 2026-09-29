"use client"

import { InfoIcon } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Context on demand: an info icon that opens a small popover on click or tap.
 * Use it instead of an intro paragraph (works on touch, unlike a tooltip).
 */
export function InfoTip({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none",
            className
          )}
        >
          <InfoIcon className="size-4" aria-hidden="true" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          collisionPadding={16}
          className="z-50 max-w-72 rounded-md border bg-popover p-3.5 text-sm text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
