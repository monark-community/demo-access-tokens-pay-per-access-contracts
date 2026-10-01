"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useRef, useState, type ReactNode } from "react"

import { t } from "@/i18n/t"
import type { Gate } from "@/lib/demo/types"
import { photosOf } from "@/lib/photos"
import { cn } from "@/lib/utils"

import { useApp } from "./app-provider"
import { GateCover } from "./gate-cover"

/**
 * What you are unlocking, in photos: a CSS scroll-snap track (swipe on
 * phones), previous/next buttons, dots, and arrow keys when focused. No
 * autoplay. Gates without photos fall back to their drawn cover.
 */
export function GateCarousel({ gate, className, children }: { gate: Gate; className?: string; children?: ReactNode }) {
  const { dict, locale } = useApp()
  const g = dict.app.gate
  const photos = photosOf(gate.photos)
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  if (photos.length === 0) {
    return (
      <div className={cn("relative", className)}>
        <GateCover gate={gate} className="aspect-[16/10] h-full" priority />
        {children}
      </div>
    )
  }

  const total = photos.length
  function go(i: number) {
    const el = track.current
    if (!el) return
    const next = (i + total) % total
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" })
    setIndex(next)
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t(g.photos, { gate: gate.title })}
      className={cn("group/carousel relative overflow-hidden bg-muted", className)}
      onKeyDown={(e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
        e.preventDefault()
        go(index + (e.key === "ArrowRight" ? 1 : -1))
      }}
    >
      <div
        ref={track}
        tabIndex={0}
        aria-label={t(g.photoN, { n: index + 1, total })}
        onScroll={(e) => {
          const el = e.currentTarget
          const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth))
          if (i !== index) setIndex(i)
        }}
        className="flex aspect-[16/10] snap-x snap-mandatory overflow-x-auto overscroll-x-contain outline-none [scrollbar-width:none] focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:ring-inset [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => (
          <div
            key={p.page}
            role="group"
            aria-roledescription="slide"
            aria-label={t(g.photoN, { n: i + 1, total })}
            className="relative h-full w-full shrink-0 snap-center"
          >
            <Image
              src={p.src}
              alt={p.alt[locale]}
              fill
              placeholder="blur"
              priority={i === 0}
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {children}

      {total > 1 && (
        <>
          <CarouselButton side="left" label={g.prevPhoto} onClick={() => go(index - 1)}>
            <ChevronLeft aria-hidden="true" />
          </CarouselButton>
          <CarouselButton side="right" label={g.nextPhoto} onClick={() => go(index + 1)}>
            <ChevronRight aria-hidden="true" />
          </CarouselButton>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/55 to-transparent px-3 pt-8 pb-2.5">
            <div className="flex gap-1.5">
              {photos.map((p, i) => (
                <button
                  key={p.page}
                  type="button"
                  aria-label={t(g.photoN, { n: i + 1, total })}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => go(i)}
                  className="grid size-6 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <span className={cn("block h-1.5 rounded-full bg-white transition-all", i === index ? "w-5" : "w-1.5 opacity-60")} />
                </button>
              ))}
            </div>
            <span aria-hidden="true" className="font-mono text-xs text-white tabular-nums">
              {index + 1} / {total}
            </span>
          </div>
        </>
      )}
    </section>
  )
}

function CarouselButton({ side, label, onClick, children }: { side: "left" | "right"; label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur-sm transition-opacity hover:bg-background focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none sm:opacity-0 sm:group-hover/carousel:opacity-100 sm:focus-visible:opacity-100",
        side === "left" ? "left-3" : "right-3"
      )}
    >
      {children}
    </button>
  )
}
