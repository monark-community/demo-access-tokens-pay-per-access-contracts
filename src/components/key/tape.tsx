"use client"

import { useState } from "react"

import type { Locale } from "@/i18n/config"
import type { AppDict as Dictionary } from "@/i18n/dictionaries/en"
import type { Gate, LogEvent } from "@/lib/demo/types"
import { formatClock, formatDate } from "@/lib/format"
import { tapeText } from "@/lib/tape-text"
import { cn } from "@/lib/utils"

const tone: Record<LogEvent["type"], string> = {
  payment: "text-primary",
  renewal: "text-primary",
  check: "text-foreground",
  action: "text-primary",
  denied: "text-destructive",
  expired: "text-muted-foreground",
  published: "text-muted-foreground",
  paused: "text-muted-foreground",
  resumed: "text-muted-foreground",
}

const mark: Record<LogEvent["type"], string> = {
  payment: "$",
  renewal: "+",
  check: "✓",
  action: "→",
  denied: "×",
  expired: "◌",
  published: "•",
  paused: "‖",
  resumed: "▸",
}

/**
 * The gateway tape: a receipt-like log printed one line at a time. Lines that
 * arrive after mount "print" in (signature moment).
 */
export function Tape({
  events,
  gates,
  dict,
  locale,
  now,
  showGate = false,
  empty,
  limit = 40,
  more,
  className,
  label,
}: {
  events: LogEvent[]
  gates: Gate[]
  dict: Dictionary
  locale: Locale
  now: number
  showGate?: boolean
  empty: string
  limit?: number
  /** "Show more" label; when set, the tape pages by `limit` instead of cutting off. */
  more?: string
  className?: string
  label: string
}) {
  const [initial] = useState(() => new Set(events.map((e) => e.id)))
  const [pages, setPages] = useState(1)
  const byId = new Map(gates.map((g) => [g.id, g]))
  const shown = events.slice(0, limit * pages)
  const today = now ? formatDate(now, locale) : ""

  return (
    <div className={cn("rounded-md border bg-card font-mono text-[0.74rem] leading-relaxed", className)}>
      {shown.length === 0 ? (
        <p className="px-4 py-8 text-center font-sans text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ol aria-label={label} aria-live="polite" className="divide-y divide-dashed divide-border">
          {shown.map((e) => {
            const gate = byId.get(e.gateId)
            const day = formatDate(e.at, locale)
            return (
              <li
                key={e.id}
                className={cn("grid grid-cols-[auto_1fr] gap-x-3 px-3.5 py-2", !initial.has(e.id) && "gp-type")}
              >
                <time dateTime={new Date(e.at).toISOString()} className="text-muted-foreground tabular-nums">
                  {day !== today && <span className="mr-1">{day}</span>}
                  {formatClock(e.at, locale)}
                </time>
                <span className={cn("min-w-0", tone[e.type])}>
                  <span aria-hidden="true" className="mr-1.5 inline-block w-3 text-center">
                    {mark[e.type]}
                  </span>
                  {tapeText(e, gate, dict, locale)
                    .split(/(GP-[A-Z0-9]{4}-[A-Z0-9]{2})/)
                    .map((part, i) =>
                      i % 2 ? (
                        <span key={i} className="whitespace-nowrap">
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                  {showGate && gate && <span className="block truncate text-muted-foreground">{gate.title}</span>}
                </span>
              </li>
            )
          })}
        </ol>
      )}
      {more && events.length > shown.length && (
        <button
          type="button"
          onClick={() => setPages((n) => n + 1)}
          className="block min-h-10 w-full border-t border-dashed px-3.5 py-2 text-center font-sans text-sm font-semibold text-primary hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
        >
          {more}
        </button>
      )}
    </div>
  )
}
