import { cn } from "@/lib/utils"

/**
 * A flat ink door with a lock light, drawn in code. `open` swings the leaf and
 * turns the light verdigris. Used for the room/locker gateway and the 404.
 */
export function Door({
  open = false,
  variant = "room",
  className,
  label,
}: {
  open?: boolean
  variant?: "room" | "locker"
  className?: string
  label?: string
}) {
  const locker = variant === "locker"
  return (
    <svg
      viewBox="0 0 200 240"
      className={cn("h-auto w-full", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* frame */}
      <rect x="30" y="16" width="140" height="218" rx="3" className="fill-muted stroke-foreground/70" strokeWidth="2" />
      {/* opening (visible when the leaf swings) */}
      <rect x="40" y="26" width="120" height="208" className="fill-foreground/85" />
      {open && <rect x="40" y="26" width="120" height="208" className="fill-primary/25" />}
      {/* leaf */}
      <g key={open ? "open" : "shut"} className={open ? "gp-swing" : undefined}>
        <rect x="40" y="26" width="120" height="208" className="fill-card stroke-foreground/70" strokeWidth="2" />
        {locker ? (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x="72" y={48 + i * 9} width="56" height="3" rx="1.5" className="fill-foreground/35" />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={`b${i}`} x="72" y={176 + i * 9} width="56" height="3" rx="1.5" className="fill-foreground/35" />
            ))}
            <text x="100" y="118" textAnchor="middle" className="fill-foreground font-mono text-[18px] font-semibold">
              14
            </text>
          </>
        ) : (
          <>
            <rect x="56" y="44" width="88" height="70" rx="2" className="fill-none stroke-foreground/30" strokeWidth="2" />
            <rect x="56" y="130" width="88" height="86" rx="2" className="fill-none stroke-foreground/30" strokeWidth="2" />
            <text x="100" y="86" textAnchor="middle" className="fill-foreground font-sans text-[22px] font-extrabold">
              B
            </text>
          </>
        )}
        {/* handle + reader */}
        <rect x="136" y="126" width="12" height="34" rx="2" className="fill-foreground/80" />
        <circle cx="142" cy="138" r="3.5" className={open ? "fill-primary" : "fill-destructive"} />
      </g>
      {/* hinge side shadow line */}
      <line x1="40" y1="26" x2="40" y2="234" className="stroke-foreground/70" strokeWidth="2" />
    </svg>
  )
}
