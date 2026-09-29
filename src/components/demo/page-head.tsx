import type { ReactNode } from "react"

/** Title block shared by the demo's sections: seat eyebrow, h1, intro, actions. */
export function PageHead({ seat, title, intro, actions }: { seat: string; title: string; intro?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="label-mono text-primary">{seat}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{title}</h1>
        {intro && <p className="mt-2 text-muted-foreground">{intro}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
