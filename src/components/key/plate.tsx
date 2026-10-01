import { cn } from "@/lib/utils"

export type PlateState = "locked" | "open" | "paused" | "live" | "expired"

const tone: Record<PlateState, string> = {
  locked: "bg-plate text-plate-foreground",
  open: "bg-primary text-primary-foreground",
  live: "bg-primary text-primary-foreground",
  paused: "bg-muted text-foreground ring-1 ring-foreground/25",
  expired: "bg-muted text-muted-foreground ring-1 ring-border",
}

/**
 * The status plate on a gate: a lock's display, mono caps with a lamp.
 * Changing `state` re-mounts the face so it flips.
 */
export function Plate({ state, label, className, size = "md" }: { state: PlateState; label: string; className?: string; size?: "sm" | "md" }) {
  const lit = state === "open" || state === "live"
  return (
    <span className={cn("inline-flex [perspective:500px]", className)}>
      <span
        key={state}
        className={cn(
          "gp-flip inline-flex items-center gap-1.5 rounded-full font-mono font-semibold tracking-[0.12em] uppercase",
          size === "sm" ? "h-6 px-2.5 text-[0.62rem]" : "h-7 px-3 text-[0.7rem]",
          tone[state]
        )}
      >
        <span aria-hidden="true" className={cn("size-1.5 rounded-full bg-current", lit ? "gp-blink" : "opacity-55")} />
        {label}
      </span>
    </span>
  )
}
