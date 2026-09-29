"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Plate } from "@/components/pass/plate"
import { KindIcon } from "@/components/pass/kind-icon"
import { Button } from "@/components/ui/button"
import { href } from "@/i18n/config"
import { isUsable, KINDS } from "@/lib/demo/rules"
import { useDemo, useNow } from "@/lib/demo/store"
import { TOKEN_LIST } from "@/lib/demo/tokens"
import type { GateKind } from "@/lib/demo/types"
import { cn } from "@/lib/utils"

import { Amount } from "./amount"
import { useApp } from "./app-provider"
import { ConnectCard } from "./connect-card"
import { GateCover } from "./gate-cover"
import { priceLine } from "./gate-text"
import { PageHead } from "./page-head"
import { PassCard } from "./pass-card"

export function PassesView() {
  const { dict, locale } = useApp()
  const p = dict.app.passes
  const demo = useDemo()
  const now = useNow()
  const [filter, setFilter] = useState<GateKind | "all">("all")

  if (!demo || !now) return <ViewSkeleton />

  const connected = demo.wallet.status === "connected"
  const me = demo.wallet.address.toLowerCase()
  const mine = demo.passes
    .filter((x) => x.holder.toLowerCase() === me)
    .sort((a, b) => Number(isUsable(b, now)) - Number(isUsable(a, now)) || b.purchasedAt - a.purchasedAt)
  const gatesById = new Map(demo.gates.map((g) => [g.id, g]))
  const kinds = KINDS.filter((k) => demo.gates.some((g) => g.kind === k))
  const shown = demo.gates.filter((g) => filter === "all" || g.kind === filter)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-10">
      <PageHead seat={dict.app.seats.passes} title={p.title} />

      <section aria-labelledby="yours" className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="yours" className="text-xl font-bold">
            {p.yours}
          </h2>
          {connected && (
            <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label={dict.app.wallet.balances}>
              {TOKEN_LIST.map((tk) => (
                <div key={tk} className="flex items-baseline gap-1.5">
                  <dt className="sr-only">{tk}</dt>
                  <dd>
                    <Amount value={demo.wallet.balances[tk]} token={tk} className="font-semibold" />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {!connected ? (
          <ConnectCard className="mt-4" />
        ) : mine.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed p-6 text-center text-muted-foreground">{p.none}</p>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mine.map((pass) => {
              const gate = gatesById.get(pass.gateId)
              if (!gate) return null
              return (
                <li key={pass.code}>
                  <Link
                    href={href(locale, `/app/gate/${gate.id}`)}
                    className="block h-full rounded-[8px] transition-transform hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none"
                  >
                    <PassCard pass={pass} gate={gate} now={now} className="h-full" />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="catalogue" className="mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="catalogue" className="text-xl font-bold">
            {p.catalogue}
          </h2>
          <div role="group" aria-label={p.filterLabel} className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {(["all", ...kinds] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={filter === k}
                onClick={() => setFilter(k)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none",
                  filter === k ? "border-foreground bg-foreground text-background" : "border-foreground/20 text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                )}
              >
                {k !== "all" && <KindIcon kind={k} className="size-3.5" />}
                {dict.kindsPlural[k]}
              </button>
            ))}
          </div>
        </div>
        {shown.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">{p.filterEmpty}</p>
            <Button variant="link" onClick={() => setFilter("all")} className="mt-2">
              {p.showAll}
            </Button>
          </div>
        ) : (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((gate) => {
              const holds = connected && demo.passes.some((x) => x.gateId === gate.id && x.holder.toLowerCase() === me && isUsable(x, now))
              return (
                <li key={gate.id}>
                  <Link
                    href={href(locale, `/app/gate/${gate.id}`)}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground/40 focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none"
                  >
                    <div className="relative">
                      <GateCover gate={gate} className="aspect-[16/10]" sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw" />
                      <Plate
                        state={holds ? "open" : gate.status === "paused" ? "paused" : "locked"}
                        label={holds ? dict.app.plate.open : gate.status === "paused" ? dict.app.plate.paused : dict.app.plate.locked}
                        size="sm"
                        className="absolute top-3 left-3"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-4">
                      <p className="label-mono flex items-center gap-1.5 text-muted-foreground">
                        <KindIcon kind={gate.kind} className="size-3.5" />
                        {dict.kinds[gate.kind]} · {dict.modes[gate.rule.mode]}
                      </p>
                      <h3 className="text-lg leading-snug font-bold">{gate.title}</h3>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <span className="font-mono text-sm font-semibold">{priceLine(gate, dict, locale)}</span>
                        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                      </div>
                      {holds && <span className="text-xs font-semibold text-primary">{p.mine}</span>}
                      {gate.status === "paused" && <span className="text-xs font-semibold text-muted-foreground">{p.paused}</span>}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

export function ViewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse px-4 py-10 sm:px-6" aria-hidden="true">
      <div className="h-4 w-40 rounded bg-muted" />
      <div className="mt-3 h-9 w-72 max-w-full rounded bg-muted" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-36 rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}
