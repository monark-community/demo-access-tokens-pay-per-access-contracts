import { Door } from "@/components/diagrams/door"
import { KindIcon } from "@/components/pass/kind-icon"
import { Plate } from "@/components/pass/plate"
import { PassStub } from "@/components/pass/stub"
import type { Dictionary } from "@/i18n"

/**
 * The hero visual is the product: Studio B's gate plate cycling LOCKED → OPEN,
 * the brass pass that opened it, and three lines of gateway tape. Pure CSS
 * animation, server-rendered, static under reduced motion.
 */
export function HeroGate({ dict }: { dict: Dictionary }) {
  const h = dict.home.hero
  return (
    <figure aria-label={h.aria} className="relative mx-auto w-full max-w-[540px]">
      <div className="rounded-lg border border-foreground/20 bg-card">
        <div className="flex items-start justify-between gap-3 border-b px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-bold">
              <KindIcon kind="room" className="size-4 text-primary" />
              <span className="truncate">{h.gate}</span>
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{h.place}</p>
          </div>
          <div className="relative h-7 shrink-0">
            <span className="gp-hero-locked absolute top-0 right-0">
              <Plate state="locked" label={h.locked} />
            </span>
            <span className="gp-hero-open">
              <Plate state="open" label={h.open} />
            </span>
          </div>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-[112px_1fr] sm:p-5">
          <div className="relative mx-auto hidden w-[112px] sm:block">
            <span className="gp-hero-locked absolute inset-0">
              <Door />
            </span>
            <span className="gp-hero-open block">
              <Door open />
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <PassStub
              kind="room"
              kindLabel={dict.modes.time}
              title={h.time}
              place={h.paid}
              code="GP-4K7Q-2M"
              remaining={h.left}
              share={0.8}
              meterLabel={dict.app.stub.meterTime}
              state="active"
              hole="card"
              headingLevel={2}
            />
            <ol className="rounded-md border border-dashed bg-background font-mono text-[0.72rem] leading-relaxed">
              <li className="flex gap-2 border-b border-dashed px-3 py-1.5 text-brass">
                <span aria-hidden="true">$</span>
                {h.tape1}
              </li>
              <li className="flex gap-2 border-b border-dashed px-3 py-1.5">
                <span aria-hidden="true">✓</span>
                {h.tape2}
              </li>
              <li className="flex gap-2 px-3 py-1.5 text-primary">
                <span aria-hidden="true">→</span>
                <span className="gp-blink" aria-hidden="true">▍</span>
                {h.tape3}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </figure>
  )
}
