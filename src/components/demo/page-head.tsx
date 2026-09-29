import type { ReactNode } from "react"

/** Title block shared by the demo's sections: seat eyebrow, h1 (+ optional info tip), actions. */
export function PageHead({
  seat,
  title,
  info,
  actions,
}: {
  seat: string
  title: string
  info?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="label-mono text-primary">{seat}</p>
        <div className="mt-2 flex items-center gap-1">
          <h1 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{title}</h1>
          {info}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
