import { cn } from "@/lib/utils"

/**
 * A key's meter. Metered keys show one segment per entry (up to 10, then
 * scaled); timed keys a bar that drains with the clock. Both are role="meter".
 */
export function Meter({
  share,
  label,
  segments,
  className,
  dead,
}: {
  share: number
  label: string
  /** Metered keys: entries left and bought. Omit for a time bar. */
  segments?: { left: number; total: number }
  className?: string
  dead?: boolean
}) {
  const aria = {
    role: "meter" as const,
    "aria-label": label,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": Math.round(share * 100),
  }
  if (segments) {
    const count = Math.min(10, Math.max(1, segments.total))
    const filled = segments.left <= 0 ? 0 : Math.max(1, Math.round((segments.left / Math.max(1, segments.total)) * count))
    return (
      <span {...aria} className={cn("flex items-center gap-[3px]", className)}>
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              "h-2 flex-1 rounded-[2px] border transition-colors duration-500",
              dead ? "border-key-foreground/30" : "border-key-foreground/45",
              i < filled && "border-key-foreground bg-key-foreground"
            )}
          />
        ))}
      </span>
    )
  }
  return (
    <span {...aria} className={cn("relative block h-2 overflow-hidden rounded-full bg-key-foreground/15", className)}>
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 rounded-full bg-key-foreground transition-[width] duration-1000 ease-linear"
        style={{ width: `${Math.round(Math.max(0, Math.min(1, share)) * 100)}%` }}
      />
    </span>
  )
}
