import { Lock } from "lucide-react"
import Image from "next/image"

import { Door } from "@/components/diagrams/door"
import { KeyFace } from "@/components/key/key-face"
import { KindIcon } from "@/components/key/kind-icon"
import { Plate } from "@/components/key/plate"
import type { Dictionary } from "@/i18n"
import { PHOTOS } from "@/lib/photos"

/**
 * The hero visual is the product: one metered key, and the two things it
 * opens on a loop, a court gate (physical, with its keypad PIN) and a video
 * course (digital, coming into focus). Pure CSS, server-rendered, shown open
 * and still under reduced motion.
 */
export function HeroGate({ dict, locale }: { dict: Dictionary; locale: "en" | "fr" }) {
  const h = dict.home.hero
  const video = PHOTOS.pottery!
  return (
    <figure aria-label={h.aria} className="relative mx-auto w-full max-w-[560px]">
      <div className="grid-bg rounded-xl border bg-card/60 p-4 sm:p-5">
        <KeyFace
          kind="court"
          kindLabel={h.keyMode}
          title={h.physical}
          place={h.physicalPlace}
          code="GP-4K7Q-2M"
          remaining={h.keyLeft}
          share={0.3}
          segments={{ left: 3, total: 10 }}
          meterLabel={dict.app.stub.meterUses}
          state="active"
          headingLevel={2}
          className="min-h-0 shadow-[0_1px_0_0_var(--border)]"
        />

        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {/* Physical: the court gate */}
          <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
            <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
              <span className="flex min-w-0 items-center gap-1.5 truncate text-xs font-semibold">
                <KindIcon kind="court" className="size-3.5 shrink-0 text-primary" />
                {dict.surfaces.physical}
              </span>
              <span className="relative h-6 shrink-0">
                <span className="gp-hero-locked absolute top-0 right-0">
                  <Plate state="locked" label={h.locked} size="sm" />
                </span>
                <span className="gp-hero-open block">
                  <Plate state="open" label={h.open} size="sm" />
                </span>
              </span>
            </div>
            <div className="relative grid flex-1 place-items-center px-6 pt-3 pb-2">
              <span className="gp-hero-locked absolute inset-x-6 top-3">
                <Door variant="court" />
              </span>
              <span className="gp-hero-open block w-full">
                <Door variant="court" open />
              </span>
            </div>
            <p className="border-t px-3 py-2 font-mono text-xs">
              <span className="text-muted-foreground">{h.pin} </span>
              <span className="relative inline-block">
                <span className="gp-hero-locked absolute left-0 font-semibold tracking-[0.18em]">••• •••</span>
                <span className="gp-hero-open font-semibold tracking-[0.18em]">482 913</span>
              </span>
            </p>
          </div>

          {/* Digital: the course */}
          <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
            <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
              <span className="flex min-w-0 items-center gap-1.5 truncate text-xs font-semibold">
                <KindIcon kind="video" className="size-3.5 shrink-0 text-primary" />
                {dict.surfaces.digital}
              </span>
              <span className="relative h-6 shrink-0">
                <span className="gp-hero-locked absolute top-0 right-0">
                  <Plate state="locked" label={h.locked} size="sm" />
                </span>
                <span className="gp-hero-open block">
                  <Plate state="open" label={h.open} size="sm" />
                </span>
              </span>
            </div>
            <div className="relative flex-1 overflow-hidden bg-plate">
              <Image src={video.src} alt="" fill sizes="260px" className="object-cover" />
              <span className="gp-hero-locked absolute inset-0 grid place-items-center bg-plate/40 backdrop-blur-md">
                <Lock className="size-6 text-white" aria-hidden="true" />
              </span>
            </div>
            <p className="truncate border-t px-3 py-2 text-xs">
              <span className="font-semibold">{h.digital}</span>
              <span className="text-muted-foreground"> · {h.digitalPlace}</span>
            </p>
          </div>
        </div>

        <ol className="mt-4 rounded-md border bg-background font-mono text-[0.72rem] leading-relaxed" lang={locale}>
          <li className="flex gap-2 border-b px-3 py-1.5">
            <span aria-hidden="true">✓</span>
            {h.tape1}
          </li>
          <li className="flex gap-2 px-3 py-1.5 text-primary">
            <span aria-hidden="true">→</span>
            {h.tape2}
            <span className="gp-blink" aria-hidden="true">
              ▍
            </span>
          </li>
        </ol>
      </div>
    </figure>
  )
}
