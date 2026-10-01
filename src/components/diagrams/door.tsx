import { cn } from "@/lib/utils"

const LEAF = { x: 40, y: 26, w: 120, h: 208 }

/** Chain-link mesh: 45° lines clipped to the leaf by hand (no SVG ids needed). */
function meshLines(step = 16) {
  const { x, y, w, h } = LEAF
  const lines: [number, number, number, number][] = []
  for (let c = -h; c < w; c += step) {
    // "\" lines: from (x + c, y) going down-right; "/" lines mirrored.
    const x1 = x + Math.max(0, c)
    const y1 = y + Math.max(0, -c)
    const len = Math.min(w - Math.max(0, c), h - Math.max(0, -c))
    if (len <= 0) continue
    lines.push([x1, y1, x1 + len, y1 + len])
    lines.push([x + w - (x1 - x), y1, x + w - (x1 - x) - len, y1 + len])
  }
  return lines
}
const MESH = meshLines()

/**
 * A gate drawn in code: a studio door, a locker, or a court's chain-link
 * gate. `open` swings the leaf and lights the reader. Used on gate pages and
 * the 404.
 */
export function Door({
  open = false,
  variant = "room",
  className,
  label,
}: {
  open?: boolean
  variant?: "room" | "locker" | "court"
  className?: string
  label?: string
}) {
  const { x, y, w, h } = LEAF
  return (
    <svg
      viewBox="0 0 200 240"
      className={cn("h-auto w-full", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* frame (posts for a court) */}
      {variant === "court" ? (
        <>
          <rect x="26" y="10" width="10" height="226" rx="2" className="fill-foreground/75" />
          <rect x="164" y="10" width="10" height="226" rx="2" className="fill-foreground/75" />
        </>
      ) : (
        <rect x="30" y="16" width="140" height="218" rx="3" className="fill-muted stroke-foreground/70" strokeWidth="2" />
      )}
      {/* opening, visible when the leaf swings */}
      <rect x={x} y={y} width={w} height={h} className={variant === "court" ? "fill-primary/10" : "fill-foreground/85"} />
      {open && <rect x={x} y={y} width={w} height={h} className="fill-primary/25" />}
      {/* leaf */}
      <g key={open ? "open" : "shut"} className={open ? "gp-swing" : undefined}>
        {variant === "court" ? (
          <>
            <rect x={x} y={y} width={w} height={h} className="fill-card/40 stroke-foreground/80" strokeWidth="4" />
            {MESH.map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-foreground/35" strokeWidth="1.4" />
            ))}
            <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} className="stroke-foreground/80" strokeWidth="4" />
          </>
        ) : (
          <rect x={x} y={y} width={w} height={h} className="fill-card stroke-foreground/70" strokeWidth="2" />
        )}
        {variant === "locker" && (
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
        )}
        {variant === "room" && (
          <>
            <rect x="56" y="44" width="88" height="70" rx="2" className="fill-none stroke-foreground/30" strokeWidth="2" />
            <rect x="56" y="130" width="88" height="86" rx="2" className="fill-none stroke-foreground/30" strokeWidth="2" />
            <text x="100" y="86" textAnchor="middle" className="fill-foreground font-mono text-[22px] font-extrabold">
              B
            </text>
          </>
        )}
        {/* handle + reader (a keypad box on a court gate) */}
        {variant === "court" ? (
          <>
            <rect x="128" y="108" width="26" height="40" rx="3" className="fill-card stroke-foreground/80" strokeWidth="2" />
            {[0, 1, 2].map((r) =>
              [0, 1].map((c) => <rect key={`${r}${c}`} x={133 + c * 9} y={118 + r * 8} width="6" height="5" rx="1" className="fill-foreground/45" />)
            )}
            <circle cx="141" cy="113" r="2.6" className={open ? "fill-primary" : "fill-muted-foreground"} />
          </>
        ) : (
          <>
            <rect x="136" y="126" width="12" height="34" rx="2" className="fill-foreground/80" />
            <circle cx="142" cy="138" r="3.5" className={open ? "fill-primary" : "fill-muted-foreground"} />
          </>
        )}
      </g>
      {variant !== "court" && <line x1={x} y1={y} x2={x} y2={y + h} className="stroke-foreground/70" strokeWidth="2" />}
    </svg>
  )
}
