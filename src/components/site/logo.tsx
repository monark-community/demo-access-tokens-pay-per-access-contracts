import { cn } from "@/lib/utils"

/**
 * A rounded-square gate with a keyhole cut through it (even-odd fill). The
 * tooth on the keyhole's stem is the bit of a key: the gate and the key in one.
 */
export const MARK_PATH =
  "M10 3h12a7 7 0 0 1 7 7v12a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7V10a7 7 0 0 1 7-7Z M14.2 16.6A4 4 0 1 1 17.8 16.6L18.15 19.4H20.6V21.6H18.4L18.6 23.6H13.4Z"

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
      <span className="font-mono text-[1.2rem] leading-none font-bold tracking-[-0.04em]">GatePay</span>
    </span>
  )
}
