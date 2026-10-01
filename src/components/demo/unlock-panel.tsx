"use client"

import { ArrowDown, Loader2, Minus, Nfc, Plus, RotateCcw, XCircle } from "lucide-react"
import { useState, type CSSProperties } from "react"

import { Plate } from "@/components/key/plate"
import { Button } from "@/components/ui/button"
import { t } from "@/i18n/t"
import { gatePin } from "@/lib/demo/ids"
import { connectWallet, topUp } from "@/lib/demo/ops"
import { isUsable, surfaceOf } from "@/lib/demo/rules"
import { roundToken } from "@/lib/demo/tokens"
import type { AccessKey, Gate } from "@/lib/demo/types"
import { formatAmount, formatDateTime, formatUnits } from "@/lib/format"
import { cn } from "@/lib/utils"

import { useApp } from "./app-provider"
import { BuyPanel } from "./buy-panel"
import { ruleSentence } from "./gate-text"
import { KeyCard } from "./key-card"
import { TxFeedback } from "./tx-feedback"
import { isOpen, RELOCK_MS, type Unlock, type UnlockPhase } from "./use-unlock"

const STAGES: Exclude<UnlockPhase, "idle" | "paying" | "denied">[] = ["mint", "insert", "check", "open"]

/**
 * The gate page's main action. One button: it pays when needed, mints the
 * key, slides it in, turns it while the gateway checks on-chain, and opens.
 * The stage track under it tells that story in words for everyone.
 */
export function UnlockPanel({
  gate,
  accessKey: key,
  unlock,
  connected,
  balance,
  now,
}: {
  gate: Gate
  accessKey: AccessKey | undefined
  unlock: Unlock
  connected: boolean
  balance: number
  now: number
}) {
  const { dict, locale } = useApp()
  const u = dict.app.unlock
  const g = dict.app.gate
  const rule = gate.rule
  const [units, setUnits] = useState(1)
  const [moreOpen, setMoreOpen] = useState(false)
  const [rejected, setRejected] = useState(false)
  const surface = surfaceOf(gate.kind)
  const usable = key ? isUsable(key, now) : false
  const needsBuy = !usable
  const total = roundToken(units * rule.price, rule.token)
  const insufficient = connected && needsBuy && total > balance
  const paused = gate.status === "paused" && needsBuy
  const open = isOpen(unlock, surface, now)
  const physicalOpen = open && surface === "physical"
  const plate = open ? "open" : paused ? "paused" : "locked"

  async function act() {
    setRejected(false)
    if (!connected) {
      const r = await connectWallet()
      if (r === "rejected") setRejected(true)
      return
    }
    await unlock.unlock(units)
  }

  let label: string
  if (!connected) label = u.connect
  else if (paused) label = u.paused
  else if (unlock.phase === "paying") label = unlock.tx.phase === "pending" ? dict.app.tx.pending : dict.app.tx.signing
  else if (unlock.busy) label = u.stages[unlock.phase as keyof typeof u.stages]
  else if (open) label = u.stages.open
  else if (unlock.phase === "open") label = u.again
  else if (!needsBuy) label = u.unlock
  else label = t(key ? u.renewFor : u.unlockFor, { amount: formatAmount(total, rule.token, locale) })

  const reason =
    unlock.phase === "denied" && unlock.result && !unlock.result.ok
      ? unlock.result.reason === "expired" && unlock.result.key?.expiresAt
        ? t(dict.app.use.denied.expired, { date: formatDateTime(unlock.result.key.expiresAt, locale) })
        : dict.app.use.denied[unlock.result.reason]
      : null

  return (
    <section aria-labelledby="unlock-title" className="flex flex-col gap-4 rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="unlock-title" className="label-mono text-muted-foreground">
          {dict.surfaces[surface]} · {dict.modes[rule.mode]}
        </h2>
        <Plate state={plate} label={dict.app.plate[plate]} size="sm" />
      </div>
      <p className="-mt-2 font-mono text-[0.95rem] font-semibold">{ruleSentence(gate, dict, locale)}</p>

      {connected && needsBuy && !paused && rule.maxUnits > 1 && (
        <div className="flex items-center justify-between gap-3" role="group" aria-labelledby={`units-${gate.id}`}>
          <span id={`units-${gate.id}`} className="text-sm font-semibold">
            {g.units}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" aria-label={g.decrease} disabled={units <= 1 || unlock.busy} onClick={() => setUnits((n) => Math.max(1, n - 1))}>
              <Minus aria-hidden="true" />
            </Button>
            <output aria-live="polite" className="min-w-24 text-center font-mono font-semibold tabular-nums">
              {formatUnits(rule, gate.kind, units, dict.units)}
            </output>
            <Button variant="outline" size="icon-sm" aria-label={g.increase} disabled={units >= rule.maxUnits || unlock.busy} onClick={() => setUnits((n) => Math.min(rule.maxUnits, n + 1))}>
              <Plus aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {insufficient && (
        <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
          <p className="font-semibold text-destructive">
            {t(g.insufficient, { token: rule.token, have: formatAmount(balance, rule.token, locale), need: formatAmount(total, rule.token, locale) })}
          </p>
          <Button variant="link" size="sm" className="mt-1" onClick={() => topUp(rule.token, 50)}>
            {t(g.topUp, { token: rule.token })}
          </Button>
        </div>
      )}

      <UnlockButton
        label={label}
        phase={unlock.phase}
        open={open}
        disabled={unlock.busy || open || paused || insufficient}
        onClick={act}
      />

      {unlock.phase !== "idle" && unlock.phase !== "paying" && <StageTrack phase={unlock.phase} minted={Boolean(unlock.minted)} code={unlock.code} />}

      {unlock.phase === "paying" || unlock.tx.phase === "failed" || unlock.tx.phase === "rejected" ? (
        <TxFeedback tx={unlock.tx} onRetry={act} />
      ) : null}
      {rejected && (
        <p role="alert" className="rounded-md bg-destructive/5 px-3 py-2 text-sm font-semibold text-destructive">
          {dict.app.wallet.rejected}
        </p>
      )}

      {reason && (
        <p role="alert" className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm font-semibold text-destructive">
          <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {reason}
        </p>
      )}

      {unlock.phase === "open" && unlock.code && (
        <div role="status" className="gp-rise rounded-md border border-primary/40 bg-background p-4">
          {surface === "physical" ? (
            physicalOpen ? (
              <>
                <p className="label-mono text-muted-foreground">{u.pin}</p>
                <p className="mt-1 font-mono text-4xl font-bold tracking-[0.18em] text-foreground tabular-nums">
                  {gatePin(unlock.code, gate.id).replace(/(\d{3})(\d{3})/, "$1 $2")}
                </p>
                <p className="mt-2 font-mono text-sm font-semibold text-primary">
                  {t(u.physicalOpen, { s: Math.max(0, Math.ceil(((unlock.openedAt ?? 0) + RELOCK_MS - now) / 1000)) })}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Nfc className="size-4" aria-hidden="true" />
                  {u.tap}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{u.physicalClosed}</p>
            )
          ) : (
            <a href="#access" className="flex items-center justify-between gap-3 text-sm font-semibold text-primary underline-offset-4 hover:underline">
              {u.digitalOpen}
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      {key && (
        <div className="flex flex-col gap-3 border-t pt-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold">{g.yourKey}</h3>
            {usable && rule.mode !== "forever" && !moreOpen && (
              <Button variant="outline" size="sm" onClick={() => setMoreOpen(true)}>
                <RotateCcw aria-hidden="true" />
                {rule.mode === "uses" ? g.buyMore : g.renew}
              </Button>
            )}
          </div>
          <KeyCard accessKey={key} gate={gate} now={now} minted={unlock.minted && unlock.phase !== "idle"} headingLevel={4} />
          {moreOpen && usable && <BuyPanel key={`renew-${key.code}`} gate={gate} renew={key} onDone={() => setMoreOpen(false)} />}
        </div>
      )}
    </section>
  )
}

/** The big button with the lock in it. The lock acts out each stage. */
function UnlockButton({
  label,
  phase,
  open,
  disabled,
  onClick,
}: {
  label: string
  phase: UnlockPhase
  open: boolean
  disabled: boolean
  onClick: () => void
}) {
  const keyIn = phase === "insert" || phase === "check" || phase === "open"
  const turned = phase === "check" || phase === "open"
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-describedby="unlock-stage"
      className={cn(
        "plate-edge group/unlock relative flex h-16 w-full items-center gap-4 overflow-hidden rounded-lg px-2.5 text-left font-mono text-lg font-bold tracking-[-0.01em] transition-[background-color,transform] duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:cursor-default",
        open ? "bg-key text-key-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90",
        disabled && !open && phase === "idle" && "opacity-60"
      )}
    >
      {/* The lock sits on a tile; the keyhole is cut in the tile's colour and the key is two-tone so it reads on both. */}
      <span
        className={cn("grid size-11 shrink-0 place-items-center rounded-md", open ? "bg-key-foreground text-key" : "bg-primary-foreground text-primary")}
        style={
          open
            ? ({ "--lock-hole": "var(--key-foreground)", "--lock-key": "var(--primary)", "--lock-key-edge": "var(--key)" } as CSSProperties)
            : ({ "--lock-hole": "var(--primary-foreground)", "--lock-key": "var(--key)", "--lock-key-edge": "var(--primary)" } as CSSProperties)
        }
      >
        <LockGlyph keyIn={keyIn} turned={turned} open={phase === "open"} jolt={phase === "denied"} />
      </span>
      <span key={label} className="gp-rise min-w-0 flex-1 truncate">
        {label}
      </span>
      {(phase === "paying" || phase === "check") && <Loader2 className="mr-2 size-5 shrink-0 animate-spin" aria-hidden="true" />}
    </button>
  )
}

/** A padlock drawn in code: the key slides in, turns, and the shackle lifts. */
function LockGlyph({ keyIn, turned, open, jolt }: { keyIn: boolean; turned: boolean; open: boolean; jolt: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="size-9 overflow-visible" aria-hidden="true">
      <path
        key={open ? "open" : jolt ? "jolt" : "shut"}
        d="M13 19v-5.5a7 7 0 0 1 14 0V19"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        className={cn("[transform-box:fill-box]", open && "gp-shackle", jolt && "gp-jolt")}
      />
      <rect x="8.5" y="18" width="23" height="17" rx="3.5" fill="currentColor" />
      {/* keyhole, cut out of the body */}
      <circle cx="20" cy="24.6" r="2.6" style={{ fill: "var(--lock-hole)" }} />
      <rect x="19" y="25.5" width="2" height="5" rx="1" style={{ fill: "var(--lock-hole)" }} />
      {keyIn && (
        <g key="key" className="gp-key-in">
          <g className={cn("[transform-box:view-box]", turned && "gp-key-turn")} style={{ transformOrigin: "20px 27px" }}>
            {/* bow, shaft and bit of a small key, entering the keyhole from the left */}
            {[
              ["var(--lock-key-edge)", 4.4],
              ["var(--lock-key)", 2.2],
            ].map(([color, width]) => (
              <g key={color} fill="none" stroke={String(color)} strokeWidth={width} strokeLinecap="round">
                <circle cx="3.5" cy="27" r="3.4" />
                <path d="M7 27h13.5M15.5 27v3.2M18.5 27v2.4" />
              </g>
            ))}
          </g>
        </g>
      )}
    </svg>
  )
}

/** Mint → key in → check → open, as words and lights. */
function StageTrack({ phase, minted, code }: { phase: UnlockPhase; minted: boolean; code?: string }) {
  const { dict } = useApp()
  const u = dict.app.unlock
  const stages = minted ? STAGES : STAGES.filter((s) => s !== "mint")
  const at = phase === "denied" ? stages.indexOf("check") : stages.indexOf(phase as (typeof STAGES)[number])
  const current = phase === "denied" ? dict.app.gateway.denied : u.stages[stages[Math.max(0, at)] ?? "open"]
  return (
    <div>
      <p id="unlock-stage" className="sr-only" aria-live="polite">
        {current}
      </p>
      <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }} aria-hidden="true">
        {stages.map((s, i) => {
          const done = i < at || (phase === "open" && i === at)
          const live = i === at && phase !== "open"
          return (
            <li key={s} className="flex flex-col gap-1.5">
              <span
                className={cn(
                  "h-1 rounded-full transition-colors duration-300",
                  done ? "bg-primary" : live ? (phase === "denied" ? "bg-destructive" : "gp-blink bg-primary") : "bg-border"
                )}
              />
              <span className={cn("truncate font-mono text-[0.68rem]", done || live ? "text-foreground" : "text-muted-foreground")}>{u.track[s]}</span>
            </li>
          )
        })}
      </ol>
      {minted && code && (phase === "mint" || phase === "insert") && (
        <p className="mt-2 font-mono text-sm font-semibold">
          <span className="gp-type inline-block">{code}</span>
        </p>
      )}
    </div>
  )
}
