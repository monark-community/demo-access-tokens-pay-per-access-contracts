"use client"

import Image from "next/image"

import { KindIcon } from "@/components/pass/kind-icon"
import type { Gate } from "@/lib/demo/types"
import { PHOTOS } from "@/lib/photos"
import { cn } from "@/lib/utils"

import { useApp } from "./app-provider"

/** A gate's cover: its photo, or a cover drawn in code for files, boards and new gates. */
export function GateCover({
  gate,
  className,
  sizes = "(min-width: 1024px) 360px, 100vw",
  priority,
}: {
  gate: Gate
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const { locale } = useApp()
  const photo = gate.photo ? PHOTOS[gate.photo] : undefined

  if (photo) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <Image src={photo.src} alt={photo.alt[locale]} fill placeholder="blur" sizes={sizes} priority={priority} className="object-cover" />
      </div>
    )
  }

  if (gate.kind === "document") {
    return (
      <div className={cn("relative grid place-items-center overflow-hidden bg-muted", className)} aria-hidden="true">
        <div className="flex aspect-[3/4] h-[78%] flex-col rounded-sm border border-foreground/25 bg-card p-[7%] text-foreground">
          <span className="h-[5%] w-1/3 rounded-full bg-brass" />
          <span className="mt-[10%] font-sans text-[clamp(0.7rem,2.2vw,1.2rem)] leading-tight font-extrabold tracking-tight">
            {gate.title.split("·")[0]}
          </span>
          <span className="mt-1 font-mono text-[0.55rem] text-muted-foreground">{gate.title.split("·")[1] ?? ""}</span>
          <span className="mt-auto space-y-[6%]">
            {[92, 80, 88, 64].map((w) => (
              <span key={w} className="block h-[3px] rounded-full bg-foreground/20" style={{ width: `${w}%` }} />
            ))}
          </span>
        </div>
      </div>
    )
  }

  if (gate.kind === "board") {
    return (
      <div className={cn("relative overflow-hidden bg-[color-mix(in_oklab,var(--brass)_22%,var(--muted))]", className)} aria-hidden="true">
        <div className="absolute inset-[8%] grid grid-cols-3 gap-[5%]">
          {[
            "bg-card rotate-[-2deg]",
            "bg-stub rotate-[1.5deg] mt-[18%]",
            "bg-card rotate-[2deg]",
            "bg-card rotate-[1deg] -mt-[4%]",
            "bg-primary rotate-[-1.5deg]",
            "bg-card rotate-[-2.5deg] mt-[10%]",
          ].map((c, i) => (
            <span key={i} className={cn("relative block rounded-[2px] border border-foreground/15 p-[10%]", c)}>
              <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-destructive" />
              <span className="block h-[3px] w-3/4 rounded-full bg-foreground/25" />
              <span className="mt-1 block h-[3px] w-1/2 rounded-full bg-foreground/20" />
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative grid place-items-center overflow-hidden bg-muted", className)} aria-hidden="true">
      <span className="grid size-20 place-items-center rounded-full border-2 border-dashed border-foreground/25 bg-card">
        <KindIcon kind={gate.kind} className="size-9 text-primary" />
      </span>
    </div>
  )
}
