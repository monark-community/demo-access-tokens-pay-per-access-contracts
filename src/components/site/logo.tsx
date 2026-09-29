import { cn } from "@/lib/utils"

/** Ticket with notched sides and a keyhole punched through (even-odd fill). */
export const MARK_PATH =
  "M6 5.5h20a3 3 0 0 1 3 3V13a3 3 0 0 0 0 6v4.5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V19a3 3 0 0 0 0-6V8.5a3 3 0 0 1 3-3Z M14.9 16.5A3.1 3.1 0 1 1 17.1 16.5L18.3 21.2H13.7Z"

export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path fill="currentColor" fillRule="evenodd" d={MARK_PATH} />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <Mark className="size-7 text-primary" />
      <span className="text-[1.3rem] leading-none font-extrabold tracking-[-0.03em]">GatePay</span>
    </span>
  )
}
