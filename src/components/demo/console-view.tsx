"use client"

import { Eye, Pause, Play, Plus, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { KindIcon } from "@/components/pass/kind-icon"
import { Plate } from "@/components/pass/plate"
import { Button } from "@/components/ui/button"
import { Wallet, WalletAddress, WalletAvatar } from "@/components/ui/wallet"
import { href } from "@/i18n/config"
import { t } from "@/i18n/t"
import { applyPause } from "@/lib/demo/ops"
import { isUsable, passState } from "@/lib/demo/rules"
import { useDemo, useNow } from "@/lib/demo/store"
import type { Gate, PassState, TokenSymbol } from "@/lib/demo/types"
import { useTx } from "@/lib/demo/use-tx"
import { formatDateTime, formatNumber, formatUses } from "@/lib/format"
import { cn } from "@/lib/utils"

import { Amount } from "./amount"
import { useApp } from "./app-provider"
import { GateCover } from "./gate-cover"
import { ruleSentence } from "./gate-text"
import { PageHead } from "./page-head"
import { ViewSkeleton } from "./passes-view"
import { TxFeedback } from "./tx-feedback"

const stateTone: Record<PassState, string> = {
  active: "text-primary",
  low: "text-brass",
  expired: "text-rust",
  spent: "text-rust",
  forever: "text-primary",
}

export function ConsoleView() {
  const { dict, locale } = useApp()
  const c = dict.app.console
  const demo = useDemo()
  const now = useNow()
  const [selected, setSelected] = useState<string | null>(null)

  if (!demo || !now) return <ViewSkeleton />

  const op = demo.operator.address.toLowerCase()
  const gates = demo.gates.filter((g) => g.ownerAddress.toLowerCase() === op)
  const ids = new Set(gates.map((g) => g.id))
  const passes = demo.passes.filter((p) => ids.has(p.gateId))
  const revenue = gates.reduce<Partial<Record<TokenSymbol, number>>>((acc, g) => {
    acc[g.rule.token] = (acc[g.rule.token] ?? 0) + g.revenue
    return acc
  }, {})
  const dayStart = new Date(now).setHours(0, 0, 0, 0)
  const checksToday = demo.log.filter((e) => e.type === "check" && ids.has(e.gateId) && e.at >= dayStart).length
  const activeNow = passes.filter((p) => isUsable(p, now)).length
  const current = gates.find((g) => g.id === selected) ?? gates[0]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-10">
      <PageHead
        seat={dict.app.seats.console}
        title={c.title}
        intro={c.intro}
        actions={
          <Button asChild>
            <Link href={href(locale, "/app/console/new")}>
              <Plus aria-hidden="true" />
              {c.newGate}
            </Link>
          </Button>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Wallet address={demo.operator.address} name={demo.operator.name} showCopy={false} />
        <span className="text-xs text-muted-foreground">{dict.app.wallet.operatorRole}</span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border lg:grid-cols-4">
        <div className="bg-card p-4">
          <dt className="label-mono text-muted-foreground">{c.revenue}</dt>
          <dd className="mt-2 flex flex-col gap-1 text-xl font-bold">
            {Object.entries(revenue).map(([tk, v]) => (
              <Amount key={tk} value={v ?? 0} token={tk as TokenSymbol} />
            ))}
          </dd>
        </div>
        <div className="bg-card p-4">
          <dt className="label-mono text-muted-foreground">{c.sold}</dt>
          <dd className="mt-2 font-mono text-xl font-bold tabular-nums">{formatNumber(gates.reduce((n, g) => n + g.sold, 0), locale)}</dd>
        </div>
        <div className="bg-card p-4">
          <dt className="label-mono text-muted-foreground">{c.active}</dt>
          <dd className="mt-2 font-mono text-xl font-bold text-primary tabular-nums">{formatNumber(activeNow, locale)}</dd>
        </div>
        <div className="bg-card p-4">
          <dt className="label-mono text-muted-foreground">{c.checks}</dt>
          <dd className="mt-2 font-mono text-xl font-bold tabular-nums">{formatNumber(checksToday, locale)}</dd>
        </div>
      </dl>

      <section aria-labelledby="gates" className="mt-10">
        <h2 id="gates" className="text-xl font-bold">
          {c.gates}
        </h2>
        {gates.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">{c.empty}</p>
            <Button asChild className="mt-4">
              <Link href={href(locale, "/app/console/new")}>{c.emptyCta}</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-4 divide-y rounded-lg border bg-card">
            {gates.map((gate) => (
              <GateRow
                key={gate.id}
                gate={gate}
                active={passes.filter((p) => p.gateId === gate.id && isUsable(p, now)).length}
                selected={current?.id === gate.id}
                onSelect={() => setSelected(gate.id)}
              />
            ))}
          </ul>
        )}
      </section>

      {current && (
        <section aria-labelledby="holders" className="mt-10">
          <h2 id="holders" className="flex items-center gap-2 text-xl font-bold">
            <Users className="size-5 text-primary" aria-hidden="true" />
            {t(c.holdersOf, { gate: current.title })}
          </h2>
          {(() => {
            const rows = passes.filter((p) => p.gateId === current.id).sort((a, b) => b.purchasedAt - a.purchasedAt)
            if (rows.length === 0) return <p className="mt-4 rounded-lg border border-dashed p-6 text-center text-muted-foreground">{c.noHolders}</p>
            return (
              <div className="mt-4 overflow-x-auto rounded-lg border bg-card">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      {[c.columns.holder, c.columns.pass, c.columns.bought, c.columns.state, c.columns.ends].map((h) => (
                        <th key={h} scope="col" className="label-mono px-4 py-3 font-medium text-muted-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed">
                    {rows.map((p) => {
                      const st = passState(p, now)
                      return (
                        <tr key={p.code}>
                          <td className="px-4 py-2.5">
                            <span className="flex items-center gap-2">
                              <WalletAvatar address={p.holder} size={22} />
                              <WalletAddress address={p.holder} className="text-xs" />
                            </span>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs">{p.code}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{formatDateTime(p.purchasedAt, locale)}</td>
                          <td className={cn("px-4 py-2.5 font-semibold", stateTone[st])}>{c.states[st]}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                            {p.expiresAt !== null
                              ? formatDateTime(p.expiresAt, locale)
                              : p.usesLeft !== null
                                ? formatUses(p.usesLeft, current.kind, dict.units)
                                : "∞"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })()}
        </section>
      )}
    </div>
  )
}

function GateRow({ gate, active, selected, onSelect }: { gate: Gate; active: number; selected: boolean; onSelect: () => void }) {
  const { dict, locale } = useApp()
  const c = dict.app.console
  const tx = useTx()
  const paused = gate.status === "paused"

  async function toggle() {
    await tx.run(
      {
        signer: "operator",
        title: t(paused ? c.resumePrompt : c.pausePrompt, { gate: gate.title }),
        movesValue: false,
        lines: [{ label: dict.app.gate.contract, value: gate.contract }, ...(paused ? [] : [{ label: c.effect, value: c.pauseLine }])],
      },
      (r) => applyPause(gate.id, !paused, r)
    )
  }

  return (
    <li className={cn("flex flex-col gap-4 p-4 md:flex-row md:items-center", selected && "bg-muted/60")}>
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <GateCover gate={gate} className="size-16 shrink-0 rounded-md" sizes="64px" />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{gate.title}</span>
            <Plate state={paused ? "paused" : "live"} label={paused ? dict.app.plate.paused : dict.app.plate.live} size="sm" />
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <KindIcon kind={gate.kind} className="size-3.5" />
            {ruleSentence(gate, dict, locale)}
          </p>
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-4 text-sm md:w-[320px]">
        <div>
          <dt className="label-mono text-muted-foreground">{c.sold}</dt>
          <dd className="font-mono font-semibold tabular-nums">{formatNumber(gate.sold, locale)}</dd>
        </div>
        <div>
          <dt className="label-mono text-muted-foreground">{c.active}</dt>
          <dd className="font-mono font-semibold text-primary tabular-nums">{formatNumber(active, locale)}</dd>
        </div>
        <div>
          <dt className="label-mono text-muted-foreground">{c.revenue}</dt>
          <dd className="font-semibold">
            <Amount value={gate.revenue} token={gate.rule.token} />
          </dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-2 md:w-auto">
        <Button variant={selected ? "secondary" : "outline"} size="sm" onClick={onSelect} aria-pressed={selected}>
          <Users aria-hidden="true" />
          {c.holders}
        </Button>
        <Button variant="outline" size="sm" onClick={toggle} disabled={tx.busy}>
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          {paused ? c.resume : c.pause}
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={href(locale, `/app/gate/${gate.id}`)} aria-label={`${c.view}: ${gate.title}`}>
            <Eye aria-hidden="true" />
          </Link>
        </Button>
      </div>
      {tx.phase !== "idle" && <TxFeedback tx={tx} onRetry={toggle} className="md:basis-full" success={tx.phase === "confirmed" ? (paused ? c.paused : c.resumed) : undefined} />}
    </li>
  )
}
