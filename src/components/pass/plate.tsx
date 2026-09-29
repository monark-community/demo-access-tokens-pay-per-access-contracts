import { cn } from "@/lib/utils"

export type PlateState = "locked" | "open" | "paused" | "live" | "expired"

const tone: Record<PlateState, string> = {
  locked: "bg-plate text-plate-foreground",
  open: "bg-primary text-primary-foreground",
  live: "bg-primary text-primary-foreground",
  paused: "bg-muted text-foreground ring-1 ring-foreground/25",
  expired: "bg-rust text-background",
}

/**
 * The status plate on a gate: engraved-looking pill with a lamp. Changing
 * `state` re-mounts the face so it flips (signature moment "punch and swing").
 */
export function Plate({ state, label, className, size = "md" }: { state: PlateState; label: string; className?: string; size?: "sm" | "md" }) {
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
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            state === "open" || state === "live" ? "bg-primary-foreground" : state === "locked" ? "bg-destructive" : "bg-current opacity-70"
          )}
        />
        {label}
      </span>
    </span>
  )
}
