"use client"

import Image from "next/image"
import { Lock, Pause, Play, Send } from "lucide-react"
import { useState } from "react"

import { Door } from "@/components/diagrams/door"
import { Plate } from "@/components/key/plate"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { t } from "@/i18n/t"
import { postToBoard } from "@/lib/demo/ops"
import { useDemo } from "@/lib/demo/store"
import type { Gate } from "@/lib/demo/types"
import { formatClock, formatNumber } from "@/lib/format"
import { photosOf } from "@/lib/photos"
import { cn } from "@/lib/utils"

import { useApp } from "./app-provider"
import { RELOCK_MS, type Unlock } from "./use-unlock"

interface AccessProps {
  gate: Gate
  unlock: Unlock
  now: number
}

/**
 * What's behind the gate, per kind, driven by the Unlock button: a door,
 * locker or court gate that swings open and relocks; a stream, course or
 * report that comes into focus; a board that takes one paid post.
 */
export function Access(props: AccessProps) {
  switch (props.gate.kind) {
    case "room":
    case "locker":
    case "court":
      return <PhysicalAccess {...props} />
    case "stream":
      return <StreamAccess {...props} />
    case "video":
      return <VideoAccess {...props} />
    case "document":
      return <DocumentAccess {...props} />
    case "board":
      return <BoardAccess {...props} />
  }
}

function Locked({ text }: { text: string }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm font-semibold">
      <Lock className="size-4" aria-hidden="true" />
      {text}
    </p>
  )
}

/* Room, locker, court: the gateway calls the lock's webhook --------------- */

function PhysicalAccess({ gate, unlock, now }: AccessProps) {
  const { dict } = useApp()
  const copy = dict.app.use[gate.kind as "room" | "locker" | "court"]
  const secondsLeft = unlock.phase === "open" ? Math.max(0, Math.ceil(((unlock.openedAt ?? 0) + RELOCK_MS - now) / 1000)) : 0
  const open = secondsLeft > 0

  return (
    <div className="grid gap-5 sm:grid-cols-[160px_1fr] sm:items-center">
      <div className="relative mx-auto w-36 sm:w-full">
        <Door open={open} variant={gate.kind as "room" | "locker" | "court"} label={`${copy.doorLabel}: ${open ? dict.app.plate.open : dict.app.plate.locked}`} />
        <Plate
          state={open ? "open" : "locked"}
          label={open ? dict.app.plate.open : dict.app.plate.locked}
          size="sm"
          className="absolute -top-2 left-1/2 -translate-x-1/2"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className={cn("font-mono text-sm font-semibold", open ? "text-primary" : "text-muted-foreground")} aria-live="polite">
          {open ? t(copy.opened, { s: secondsLeft }) : copy.closed}
        </p>
        {gate.webhookUrl && <p className="font-mono text-xs break-all text-muted-foreground">POST {gate.webhookUrl}</p>}
      </div>
    </div>
  )
}

/* Livestream: plays once unlocked ----------------------------------------- */

function StreamAccess({ gate, unlock, now }: AccessProps) {
  const { dict, locale } = useApp()
  const s = dict.app.use.stream
  const photo = photosOf(gate.photos)[0]
  const open = unlock.phase === "open"
  const [paused, setPaused] = useState(false)
  const playing = open && !paused
  const elapsed = playing ? Math.max(0, Math.floor((now - (unlock.openedAt ?? now)) / 1000)) : 0

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-md bg-plate">
        {photo && (
          <Image
            key={open ? "open" : "shut"}
            src={photo.src}
            alt={photo.alt[locale]}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className={cn("object-cover", open ? "gp-reveal" : "opacity-40 blur-md grayscale")}
          />
        )}
        {playing ? (
          <>
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-primary px-2 py-0.5 font-mono text-[0.68rem] font-semibold tracking-widest text-primary-foreground uppercase">
              <span className="gp-blink size-1.5 rounded-full bg-current" aria-hidden="true" />
              {s.playing}
            </span>
            <span className="absolute top-3 right-3 rounded-sm bg-black/70 px-2 py-0.5 font-mono text-[0.7rem] text-white">
              {t(s.viewers, { n: formatNumber(147 + (elapsed % 7), locale) })}
            </span>
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-black/70 px-3 py-2 text-white">
              <Button size="icon-sm" variant="ghost" className="text-white hover:bg-white/15 hover:text-white" aria-label={s.stop} onClick={() => setPaused(true)}>
                <Pause aria-hidden="true" />
              </Button>
              <span className="font-mono text-xs tabular-nums">
                {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
              </span>
              <span className="relative h-1 flex-1 rounded-full bg-white/25">
                <span className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${Math.min(100, 8 + elapsed / 36)}%` }} />
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center p-4 text-center">
            {open ? (
              <Button size="lg" onClick={() => setPaused(false)}>
                <Play aria-hidden="true" />
                {s.action}
              </Button>
            ) : (
              <Locked text={s.locked} />
            )}
          </div>
        )}
      </div>
      {open && <p className="text-xs text-muted-foreground">{s.replay}</p>}
    </div>
  )
}

/* Video course: the parts unlock together --------------------------------- */

function VideoAccess({ gate, unlock }: AccessProps) {
  const { dict, locale } = useApp()
  const v = dict.app.use.video
  const parts = dict.seed.videoParts
  const photo = photosOf(gate.photos)[0]
  const open = unlock.phase === "open"
  const [playing, setPlaying] = useState(0)
  const current = open ? playing || 1 : 0

  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
      <div className="relative aspect-video overflow-hidden rounded-md bg-plate">
        {photo && (
          <Image
            key={open ? "open" : "shut"}
            src={photo.src}
            alt={photo.alt[locale]}
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className={cn("object-cover", open ? "gp-reveal" : "opacity-40 blur-md grayscale")}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 font-mono text-xs text-white">
          {open ? `${t(v.playing, { n: current })} · ${parts[current - 1]}` : v.locked}
        </div>
      </div>
      <div>
        <h3 className="label-mono text-muted-foreground">{v.parts}</h3>
        <ol className="mt-2 divide-y rounded-md border">
          {parts.map((title, i) => (
            <li key={title} className="flex items-center gap-3 px-3 py-2 text-sm">
              <span className="w-5 font-mono text-xs text-muted-foreground">{i + 1}</span>
              <span className={cn("min-w-0 flex-1", current === i + 1 && "font-semibold text-primary")}>{title}</span>
              {open ? (
                <Button size="icon-sm" variant="ghost" aria-label={t(v.action, { n: i + 1 })} onClick={() => setPlaying(i + 1)}>
                  <Play aria-hidden="true" />
                </Button>
              ) : (
                <Lock className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* Document: the full report comes into focus ------------------------------ */

function DocumentAccess({ gate, unlock }: AccessProps) {
  const { dict } = useApp()
  const d = dict.app.use.document
  const report = dict.seed.report
  const open = unlock.phase === "open"
  const isSeedReport = gate.id === "lowwater-report"

  return (
    <article className="rounded-md border bg-background p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="label-mono text-muted-foreground">{t(d.pages, { n: 38 })}</p>
        {open && <span className="text-xs font-semibold text-primary">{d.opened}</span>}
      </div>
      <p className="mt-3 text-[0.95rem] leading-relaxed font-medium">{isSeedReport ? report.abstract : gate.description}</p>
      {open ? (
        <div className="gp-reveal mt-3 space-y-3 text-[0.95rem] leading-relaxed text-muted-foreground">
          {(isSeedReport ? report.body : [gate.description]).map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-2.5 blur-[2px]" aria-hidden="true">
            {[96, 88, 93, 70, 90, 84, 62].map((w, i) => (
              <span key={i} className="block h-2.5 rounded-sm bg-foreground/12" style={{ width: `${w}%` }} />
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{d.locked}</p>
        </>
      )}
    </article>
  )
}

/* Notice board: one unlock buys one post ---------------------------------- */

function BoardAccess({ unlock }: AccessProps) {
  const { dict, locale } = useApp()
  const b = dict.app.use.board
  const demo = useDemo()
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [posted, setPosted] = useState(false)
  const posts = demo?.board ?? []
  const open = unlock.phase === "open" && Boolean(unlock.code)

  function post() {
    const clean = text.trim()
    if (!clean) return setError(b.empty)
    if (clean.length > 140) return setError(b.tooLong)
    setError(null)
    if (!unlock.code) return
    postToBoard(unlock.code, clean)
    setText("")
    setPosted(true)
    unlock.reset()
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        {open ? (
          <>
            <Label htmlFor="board-post" className="font-semibold">
              {b.label}
            </Label>
            <textarea
              id="board-post"
              value={text}
              maxLength={160}
              rows={3}
              onChange={(e) => setText(e.target.value)}
              placeholder={b.placeholder}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "board-error" : "board-count"}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 aria-invalid:border-destructive"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span id="board-count" className="font-mono tabular-nums">
                {text.trim().length} / 140
              </span>
              {error && (
                <span id="board-error" role="alert" className="font-semibold text-destructive">
                  {error}
                </span>
              )}
            </div>
            <Button onClick={post} className="self-start">
              <Send aria-hidden="true" />
              {b.action}
            </Button>
          </>
        ) : posted ? (
          <p role="status" className="text-sm font-semibold text-primary">
            {b.posted}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{b.locked}</p>
        )}
      </div>
      <div>
        <h3 className="label-mono text-muted-foreground">{b.recent}</h3>
        <ul className="mt-2 space-y-2">
          {posts.slice(0, 5).map((p, i) => (
            <li key={p.id} className={cn("rounded-sm border bg-card px-3 py-2 text-sm", i === 0 && posted && "gp-rise border-primary")}>
              <p>{p.text}</p>
              <p className="mt-1 font-mono text-[0.68rem] text-muted-foreground">
                {p.author || p.code} · {formatClock(p.at, locale, false)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
