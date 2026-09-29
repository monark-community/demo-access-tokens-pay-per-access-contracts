import { cn } from "@/lib/utils"

/**
 * Remaining time or uses as a row of perforation dots that empty as the pass
 * is consumed ("the draining stub").
 */
export function Dots({
  share,
  count = 12,
  label,
  className,
  tone = "stub",
}: {
  share: number
  count?: number
  label: string
  className?: string
  tone?: "stub" | "rust"
}) {
  const filled = share <= 0 ? 0 : Math.max(1, Math.round(share * count))
  return (
    <span
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(share * 100)}
      className={cn("flex items-center gap-[3px]", className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "size-[7px] rounded-full border transition-colors duration-500",
            tone === "rust" ? "border-rust/60" : "border-stub-foreground/45",
            i < filled && (tone === "rust" ? "border-rust bg-rust" : "border-stub-foreground bg-stub-foreground")
          )}
        />
      ))}
    </span>
  )
}
