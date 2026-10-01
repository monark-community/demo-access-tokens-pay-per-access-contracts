import type { GateKind, PassState } from "@/lib/demo/types"
import { cn } from "@/lib/utils"

import { Dots } from "./dots"
import { KindIcon } from "./kind-icon"

const STUB_W = 128

/**
 * The brass pass stub: what a payment turns into. Left part names the gate,
 * the tear-off right part shows what's left as draining perforation dots.
 * `punched` plays the punch (signature moment); `stamp` stamps it EXPIRED/USED UP.
 */
export function PassStub({
  kind,
  kindLabel,
  title,
  place,
  code,
  serial,
  remaining,
  remainingLabel,
  caption,
  share,
  meterLabel,
  state,
  stamp,
  punched,
  hole = "background",
  className,
  headingLevel = 3,
}: {
  kind: GateKind
  kindLabel: string
  title: string
  place?: string
  code: string
  serial?: string
  remaining: string
  remainingLabel?: string
  caption?: string
  share: number
  meterLabel: string
  state: PassState
  stamp?: string
  punched?: boolean
  hole?: "background" | "card"
  className?: string
  headingLevel?: 2 | 3 | 4
}) {
  const dead = state === "expired" || state === "spent"
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4"
  return (
    <div
      className={cn("relative isolate", className)}
      style={{ ["--stub-w" as string]: `${STUB_W}px` }}
    >
      <div
        className="ticket-h grid h-full min-h-[132px] grid-cols-[minmax(0,1fr)_var(--stub-w)] bg-stub text-stub-foreground"
        style={{ ["--notch-at" as string]: `calc(100% - ${STUB_W}px)` }}
      >
        <div className={cn("flex min-w-0 flex-col gap-1 p-4 pr-5", dead && "opacity-60")}>
          <span className="label-mono flex items-center gap-1.5 opacity-80">
            <KindIcon kind={kind} className="size-3.5" />
            {kindLabel}
          </span>
          <Heading className="text-[1.05rem] leading-snug font-bold text-balance">{title}</Heading>
          {place && <span className="truncate text-xs opacity-80">{place}</span>}
          <span className="mt-auto pt-2 font-mono text-[0.72rem] font-medium tracking-wide">
            {code}
            {serial && <span className="opacity-70"> · {serial}</span>}
          </span>
        </div>
        <div className={cn("perforation-y relative flex flex-col justify-center gap-1.5 px-3.5 py-4", dead && "opacity-60")}>
          {remainingLabel && <span className="label-mono opacity-80">{remainingLabel}</span>}
          <span className="font-mono text-[1.02rem] leading-tight font-semibold tabular-nums">{remaining}</span>
          <Dots share={share} count={10} label={meterLabel} tone={dead ? "rust" : "stub"} />
          {caption && <span className="text-[0.7rem] leading-snug opacity-85">{caption}</span>}
        </div>
      </div>
      {punched && (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "gp-punch absolute top-3 right-[calc(var(--stub-w)/2-8px)] size-4 rounded-full ring-1 ring-stub-foreground/30",
              hole === "card" ? "bg-card" : "bg-background"
            )}
          />
          <span aria-hidden="true" className="gp-chad absolute top-3 right-[calc(var(--stub-w)/2-8px)] size-4 rounded-full bg-stub ring-1 ring-stub-foreground/40" />
        </>
      )}
      {stamp && (
        <span
          aria-hidden="true"
          className="gp-stamp pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 rounded-sm border-[2.5px] border-rust bg-stub px-2 py-0.5 font-mono text-sm font-semibold tracking-[0.18em] text-rust uppercase"
        >
          {stamp}
        </span>
      )}
    </div>
  )
}
