"use client"

import Image from "next/image"
import { CheckCircle2, Loader2, Lock, Pause, Play, Send, XCircle } from "lucide-react"
import { useState } from "react"

import { Door } from "@/components/diagrams/door"
import { Plate } from "@/components/pass/plate"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { t } from "@/i18n/t"
import { checkPass, postToBoard, type CheckResult } from "@/lib/demo/ops"
import { demoNow, useDemo } from "@/lib/demo/store"
import type { Gate, Pass } from "@/lib/demo/types"
import { formatClock, formatDateTime, formatNumber } from "@/lib/format"
import { PHOTOS } from "@/lib/photos"
import { cn } from "@/lib/utils"

import { useApp } from "./app-provider"

type CheckState = { phase: "idle" } | { phase: "checking" } | { phase: "done"; result: CheckResult; at: number }

/** Run a gateway check for the visitor's pass. */
function useCheck(gate: Gate, pass: Pass | undefined, now: number) {
  const [state, setState] = useState<CheckState>({ phase: "idle" })
  async function run(): Promise<CheckResult | null> {
    if (!pass) return null
    setState({ phase: "checking" })
    const result = await checkPass(gate.id, pass.code)
    setState({ phase: "done", result, at: now })
    return result
  }
  return { state, run, reset: () => setState({ phase: "idle" }) }
}

function CheckLine({ state, onRenew }: { state: CheckState; onRenew?: () => void }) {
  const { dict, locale } = useApp()
  const u = dict.app.use
  if (state.phase === "idle") return null
  if (state.phase === "checking") {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {u.checking}
      </p>
    )
  }
  const r = state.result
  if (r.ok) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm font-semibold text-primary">
        <CheckCircle2 className="size-4" aria-hidden="true" />
        {t(u.granted, { block: formatNumber(r.block, locale) })}
      </p>
    )
  }
  const reasonText =
    r.reason === "expired" && r.pass?.expiresAt
      ? t(u.denied.expired, { date: formatDateTime(r.pass.expiresAt, locale) })
      : u.denied[r.reason]
  return (
    <div role="alert" className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm">
      <XCircle className="size-4 text-destructive" aria-hidden="true" />
      <span className="font-semibold text-destructive">{reasonText}</span>
      {onRenew && (r.reason === "expired" || r.reason === "spent") && (
        <Button size="sm" variant="outline" onClick={onRenew} className="ml-auto">
          {r.reason === "expired" ? dict.app.gate.renew : dict.app.gate.buyMore}
        </Button>
      )}
    </div>
  )
}

interface AccessProps {
  gate: Gate
  pass: Pass | undefined
  now: number
  connected: boolean
  onRenew: () => void
}

/** The thing behind the gate, per kind: door, player, course, file or board. */
export function Access(props: AccessProps) {
  switch (props.gate.kind) {
    case "room":
    case "locker":
      return <DoorAccess {...props} />
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

function NeedPass() {
  const { dict } = useApp()
  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <Lock className="size-4" aria-hidden="true" />
      {dict.app.use.needPass}
    </p>
  )
}

/* Room and locker: the gateway calls the device webhook ------------------ */

function DoorAccess({ gate, pass, now, onRenew }: AccessProps) {
  const { dict } = useApp()
  const copy = gate.kind === "locker" ? dict.app.use.locker : dict.app.use.room
  const check = useCheck(gate, pass, now)
  const [openUntil, setOpenUntil] = useState(0)
  const secondsLeft = Math.max(0, Math.ceil((openUntil - now) / 1000))
  const open = secondsLeft > 0

  async function use() {
    const r = await check.run()
    if (r?.ok) setOpenUntil(demoNow() + 10_500)
  }

  return (
    <div className="grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center">
      <div className="relative mx-auto w-32 sm:w-full">
        <Door
          open={open}
          variant={gate.kind === "locker" ? "locker" : "room"}
          label={`${copy.doorLabel}: ${open ? dict.app.plate.open : dict.app.plate.locked}`}
        />
        <Plate
          state={open ? "open" : "locked"}
          label={open ? dict.app.plate.open : dict.app.plate.locked}
          size="sm"
          className="absolute -top-2 left-1/2 -translate-x-1/2"
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className={cn("font-mono text-sm font-semibold", open ? "text-primary" : "text-muted-foreground")} aria-live="polite">
          {open ? t(copy.opened, { s: secondsLeft }) : copy.closed}
        </p>
        {gate.webhookUrl && (
          <p className="font-mono text-xs break-all text-muted-foreground">
            POST {gate.webhookUrl}
          </p>
        )}
        {pass ? (
          <Button onClick={use} disabled={check.state.phase === "checking" || open} className="self-start">
            {copy.action}
          </Button>
        ) : (
          <NeedPass />
        )}
        <CheckLine state={check.state} onRenew={onRenew} />
      </div>
    </div>
  )
}

/* Livestream -------------------------------------------------------------- */

function StreamAccess({ gate, pass, now, onRenew }: AccessProps) {
  const { dict, locale } = useApp()
  const s = dict.app.use.stream
  const check = useCheck(gate, pass, now)
  const [startedAt, setStartedAt] = useState(0)
  const playing = startedAt > 0
  const photo = gate.photo ? PHOTOS[gate.photo] : undefined
  const elapsed = playing ? Math.max(0, Math.floor((now - startedAt) / 1000)) : 0

  async function play() {
    const r = await check.run()
    if (r?.ok) setStartedAt(demoNow())
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-md bg-plate">
        {photo && (
          <Image
            src={photo.src}
            alt={photo.alt[locale]}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className={cn("object-cover transition-[filter,opacity] duration-500", playing ? "opacity-100" : "opacity-35 grayscale")}
          />
        )}
        {playing ? (
          <>
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-destructive px-2 py-0.5 font-mono text-[0.68rem] font-semibold tracking-widest text-white uppercase">
              <span className="gp-blink size-1.5 rounded-full bg-white" aria-hidden="true" />
              {s.playing}
            </span>
            <span className="absolute top-3 right-3 rounded-sm bg-black/70 px-2 py-0.5 font-mono text-[0.7rem] text-white">
              {t(s.viewers, { n: formatNumber(147 + (elapsed % 7), locale) })}
            </span>
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-black/70 px-3 py-2 text-white">
              <Button size="icon-sm" variant="ghost" className="text-white hover:bg-white/15 hover:text-white" aria-label={s.stop} onClick={() => setStartedAt(0)}>
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
            {pass ? (
              <Button size="lg" onClick={play} disabled={check.state.phase === "checking"}>
                <Play aria-hidden="true" />
                {s.action}
              </Button>
            ) : (
              <p className="inline-flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm font-semibold">
                <Lock className="size-4" aria-hidden="true" />
                {s.locked}
              </p>
            )}
          </div>
        )}
      </div>
      {pass && <p className="text-xs text-muted-foreground">{s.replay}</p>}
      <CheckLine state={check.state} onRenew={onRenew} />
    </div>
  )
}

/* Video course ------------------------------------------------------------ */

function VideoAccess({ gate, pass, now, onRenew }: AccessProps) {
  const { dict, locale } = useApp()
  const v = dict.app.use.video
  const check = useCheck(gate, pass, now)
  const [playing, setPlaying] = useState(0)
  const parts = dict.seed.videoParts
  const photo = gate.photo ? PHOTOS[gate.photo] : undefined

  async function play(n: number) {
    const r = await check.run()
    setPlaying(r?.ok ? n : 0)
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
      <div className="relative aspect-video overflow-hidden rounded-md bg-plate">
        {photo && (
          <Image
            src={photo.src}
            alt={photo.alt[locale]}
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className={cn("object-cover", playing ? "opacity-100" : "opacity-35 grayscale")}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 font-mono text-xs text-white">
          {playing ? t(v.playing, { n: playing }) + ` · ${parts[playing - 1]}` : pass ? parts[0] : v.locked}
        </div>
      </div>
      <div>
        <h3 className="label-mono text-muted-foreground">{v.parts}</h3>
        <ol className="mt-2 divide-y divide-dashed rounded-md border">
          {parts.map((title, i) => (
            <li key={title} className="flex items-center gap-3 px-3 py-2 text-sm">
              <span className="w-5 font-mono text-xs text-muted-foreground">{i + 1}</span>
              <span className={cn("min-w-0 flex-1", playing === i + 1 && "font-semibold text-primary")}>{title}</span>
              {pass ? (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={t(v.action, { n: i + 1 })}
                  disabled={check.state.phase === "checking"}
                  onClick={() => play(i + 1)}
                >
                  <Play aria-hidden="true" />
                </Button>
              ) : (
                <Lock className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>
      <div className="md:col-span-2">
        <CheckLine state={check.state} onRenew={onRenew} />
      </div>
    </div>
  )
}

/* Document ---------------------------------------------------------------- */

function DocumentAccess({ gate, pass, now, onRenew }: AccessProps) {
  const { dict } = useApp()
  const d = dict.app.use.document
  const report = dict.seed.report
  const check = useCheck(gate, pass, now)
  const [open, setOpen] = useState(false)
  const isSeedReport = gate.id === "lowwater-report"

  async function reveal() {
    const r = await check.run()
    setOpen(Boolean(r?.ok))
  }

  return (
    <div className="flex flex-col gap-4">
      <article className="rounded-md border bg-background p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="label-mono text-muted-foreground">{t(d.pages, { n: 38 })}</p>
          {open && <span className="text-xs font-semibold text-primary">{d.opened}</span>}
        </div>
        <p className="mt-3 text-[0.95rem] leading-relaxed font-medium">{isSeedReport ? report.abstract : gate.description}</p>
        {open ? (
          <div className="gp-rise mt-3 space-y-3 text-[0.95rem] leading-relaxed text-muted-foreground">
            {(isSeedReport ? report.body : [gate.description]).map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-2.5" aria-hidden="true">
            {[96, 88, 93, 70, 90, 84, 62].map((w, i) => (
              <span key={i} className="block h-2.5 rounded-sm bg-foreground/12" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}
      </article>
      {!open && (pass ? <Button onClick={reveal} disabled={check.state.phase === "checking"} className="self-start">{d.action}</Button> : <p className="text-sm text-muted-foreground">{d.locked}</p>)}
      <CheckLine state={check.state} onRenew={onRenew} />
    </div>
  )
}

/* Notice board: a payment that posts a message ---------------------------- */

function BoardAccess({ gate, pass, now, onRenew }: AccessProps) {
  const { dict, locale } = useApp()
  const b = dict.app.use.board
  const demo = useDemo()
  const check = useCheck(gate, pass, now)
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [posted, setPosted] = useState(false)
  const posts = demo?.board ?? []

  async function post() {
    const clean = text.trim()
    if (!clean) return setError(b.empty)
    if (clean.length > 140) return setError(b.tooLong)
    setError(null)
    setPosted(false)
    const r = await check.run()
    if (r?.ok && pass) {
      postToBoard(pass.code, clean)
      setText("")
      setPosted(true)
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        {pass ? (
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
            <Button onClick={post} disabled={check.state.phase === "checking"} className="self-start">
              <Send aria-hidden="true" />
              {t(b.action, { n: pass.usesLeft ?? 0 })}
            </Button>
            {posted && check.state.phase === "done" && check.state.result.ok && (
              <p role="status" className="text-sm font-semibold text-primary">
                {b.posted}
              </p>
            )}
            <CheckLine state={check.state} onRenew={onRenew} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{b.locked}</p>
        )}
      </div>
      <div>
        <h3 className="label-mono text-muted-foreground">{b.recent}</h3>
        <ul className="mt-2 space-y-2">
          {posts.slice(0, 5).map((p, i) => (
            <li
              key={p.id}
              className={cn(
                "rounded-sm border bg-card px-3 py-2 text-sm",
                i === 0 && posted && "gp-rise border-primary",
                i % 2 ? "rotate-[0.4deg]" : "-rotate-[0.3deg]"
              )}
            >
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
