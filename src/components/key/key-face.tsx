import { Mark } from "@/components/site/logo"
import type { GateKind, KeyState } from "@/lib/demo/types"
import { cn } from "@/lib/utils"

import { KindIcon } from "./kind-icon"
import { Meter } from "./meter"

/**
 * A digital key, drawn as an access card: what a payment turns into. Top: the
 * kind of key and its contact chip; middle: the gate; bottom: the code and
 * the meter (a draining bar, entry segments, or ∞). `minted` plays the mint.
 */
export function KeyFace({
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
  segments,
  forever,
  state,
  stamp,
  minted,
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
  /** Metered keys: entries left and bought. */
  segments?: { left: number; total: number }
  forever?: boolean
  state: KeyState
  stamp?: string
  minted?: boolean
  className?: string
  headingLevel?: 2 | 3 | 4
}) {
  const dead = state === "expired" || state === "spent"
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4"
  return (
    <div
      className={cn(
        "relative isolate flex min-h-[156px] flex-col overflow-hidden rounded-lg bg-key p-4 text-key-foreground",
        dead && "bg-muted text-muted-foreground",
        minted && "gp-mint",
        className
      )}
    >
      {/* Watermark: the GatePay keyhole, oversized off the right edge. */}
      <Mark className="pointer-events-none absolute -right-6 -bottom-8 size-36 opacity-[0.08]" />

      <div className="flex items-start justify-between gap-3">
        <span className="label-mono flex items-center gap-1.5">
          <KindIcon kind={kind} className="size-3.5" />
          {kindLabel}
        </span>
        {stamp ? (
          <span className="rounded-sm border border-current px-1.5 py-0.5 font-mono text-[0.62rem] font-semibold tracking-[0.16em] uppercase">
            {stamp}
          </span>
        ) : (
          <Chip />
        )}
      </div>

      <div className={cn("mt-2 min-w-0", dead && "opacity-80")}>
        <Heading className="text-[1rem] leading-snug font-bold text-balance">{title}</Heading>
        {place && <p className="truncate text-xs opacity-80">{place}</p>}
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-4">
        <div className="flex items-baseline justify-between gap-3 font-mono">
          <span className="text-[0.74rem] font-medium tracking-wide">
            {code}
            {serial && <span className="opacity-70"> · {serial}</span>}
          </span>
          <span className="shrink-0 text-right">
            {remainingLabel && <span className="label-mono mr-1.5 opacity-75">{remainingLabel}</span>}
            <span className="text-[0.95rem] font-semibold tabular-nums">{remaining}</span>
          </span>
        </div>
        {forever ? (
          // Never drains: a full bar, decorative (the ∞ above says it).
          <span aria-hidden="true" className="block h-2 rounded-full bg-key-foreground" />
        ) : (
          <Meter share={share} label={meterLabel} segments={segments} dead={dead} />
        )}
        {caption && <span className="text-[0.72rem] leading-snug opacity-85">{caption}</span>}
      </div>
    </div>
  )
}

/** The contact chip of an access card, drawn in code. */
function Chip() {
  return (
    <svg viewBox="0 0 28 20" className="h-5 w-7 shrink-0" aria-hidden="true">
      <rect x="0.75" y="0.75" width="26.5" height="18.5" rx="3.5" className="fill-key-foreground/10 stroke-current" strokeWidth="1.2" opacity="0.7" />
      <path d="M9.5 1v18M18.5 1v18M1 7h8.5M18.5 7H27M1 13h8.5M18.5 13H27" className="stroke-current" strokeWidth="1" opacity="0.55" fill="none" />
    </svg>
  )
}
