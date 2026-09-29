"use client"

import { ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { KindIcon } from "@/components/pass/kind-icon"
import { Plate } from "@/components/pass/plate"
import { Tape } from "@/components/pass/tape"
import { Button } from "@/components/ui/button"
import { TxStatus } from "@/components/ui/tx-status"
import { href } from "@/i18n/config"
import { t } from "@/i18n/t"
import { bestPass, isUsable } from "@/lib/demo/rules"
import { useDemo, useNow } from "@/lib/demo/store"
import { shortAddress } from "@/lib/format"

import { Access } from "./access"
import { useApp } from "./app-provider"
import { BuyPanel } from "./buy-panel"
import { GateCover } from "./gate-cover"
import { ruleSentence } from "./gate-text"
import { PassCard } from "./pass-card"
import { ViewSkeleton } from "./passes-view"

export function GateView({ id }: { id: string }) {
  const { dict, locale } = useApp()
  const g = dict.app.gate
  const demo = useDemo()
  const now = useNow()
  const [punched, setPunched] = useState<string | null>(null)
  const [renewOpen, setRenewOpen] = useState(false)

  if (!demo || !now) return <ViewSkeleton />
  const gate = demo.gates.find((x) => x.id === id)
  if (!gate) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">{g.notFoundTitle}</h1>
        <p className="mt-3 text-muted-foreground">{g.notFoundBody}</p>
        <Button asChild className="mt-6">
          <Link href={href(locale, "/app")}>{g.back}</Link>
        </Button>
      </div>
    )
  }

  const connected = demo.wallet.status === "connected"
  const pass = connected ? bestPass(demo.passes, gate.id, demo.wallet.address, now) : undefined
  const usable = pass ? isUsable(pass, now) : false
  const canRenew = pass && gate.rule.mode !== "forever"
  const showRenew = canRenew && (renewOpen || !usable)
  const events = demo.log.filter((e) => e.gateId === gate.id)
  const plate = usable ? "open" : gate.status === "paused" ? "paused" : "locked"

  function openRenew() {
    setRenewOpen(true)
    window.setTimeout(() => document.getElementById("buy")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8">
      <Link
        href={href(locale, "/app")}
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {g.back}
      </Link>

      {/* Phones read: gate, pass/buy, access, activity. Desktop: gate + access left, pass + activity right. */}
      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-8">
          <section className="min-w-0 overflow-hidden rounded-lg border bg-card lg:col-start-1 lg:row-start-1">
            <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="relative">
                <GateCover gate={gate} className="aspect-[16/10] h-full md:aspect-auto md:min-h-64" priority sizes="(min-width: 1024px) 340px, 100vw" />
                <Plate state={plate} label={dict.app.plate[plate]} className="absolute top-3 left-3" />
              </div>
              <div className="flex flex-col gap-2 p-5">
                <p className="label-mono flex items-center gap-1.5 text-muted-foreground">
                  <KindIcon kind={gate.kind} className="size-3.5" />
                  {dict.kinds[gate.kind]}
                </p>
                <h1 className="text-2xl leading-tight font-extrabold tracking-[-0.02em] sm:text-3xl">{gate.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {gate.place} · {t(g.by, { owner: gate.ownerName })}
                </p>
                <p className="mt-1 text-[0.95rem]">{gate.description}</p>
                <div className="mt-auto rounded-md bg-stub p-3 text-stub-foreground">
                  <p className="label-mono opacity-80">
                    {g.rule} · {dict.modes[gate.rule.mode]}
                  </p>
                  <p className="mt-1 font-bold">{ruleSentence(gate, dict, locale)}</p>
                  <p className="mt-1 font-mono text-[0.7rem] opacity-80">
                    {g.contract} {shortAddress(gate.contract)}
                  </p>
                </div>
              </div>
            </div>
          </section>

        <div className="flex min-w-0 flex-col gap-6 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <aside className="flex flex-col gap-6">
          {pass && (
            <section aria-labelledby="your-pass" className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h2 id="your-pass" className="text-lg font-bold">
                  {g.yourPass}
                </h2>
                {canRenew && usable && !renewOpen && (
                  <Button variant="outline" size="sm" onClick={() => setRenewOpen(true)}>
                    <RotateCcw aria-hidden="true" />
                    {gate.rule.mode === "uses" ? g.buyMore : g.renew}
                  </Button>
                )}
              </div>
              <PassCard pass={pass} gate={gate} now={now} punched={punched === pass.code} headingLevel={3} />
              {punched === pass.code && (
                <div role="status" className="gp-rise flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  <TxStatus status="confirmed" hash={pass.txHash} label={dict.app.tx.confirmedLabel} />
                  <span className="font-semibold">{g.purchased}</span>
                </div>
              )}
            </section>
          )}

          {(!pass || showRenew) && (
            <BuyPanel
              key={pass && showRenew ? `renew-${pass.code}` : "buy"}
              gate={gate}
              renew={pass && showRenew ? pass : undefined}
              onDone={(code, renewed) => {
                if (renewed) setRenewOpen(true)
                else setPunched(code)
              }}
            />
          )}
          </aside>

          <section aria-labelledby="activity" className="order-last hidden lg:block">
            <h2 id="activity" className="mb-3 text-lg font-bold">
              {g.activity}
            </h2>
            <Tape events={events} gates={demo.gates} dict={dict} locale={locale} now={now} empty={g.activityEmpty} limit={7} label={g.activity} />
          </section>
        </div>

        <section aria-labelledby="access" className="min-w-0 rounded-lg border bg-card p-5 lg:col-start-1 lg:row-start-2">
          <h2 id="access" className="mb-4 text-lg font-bold">
            {g.access}
          </h2>
          <Access gate={gate} pass={pass} now={now} connected={connected} onRenew={openRenew} />
        </section>

        <section aria-labelledby="activity-m" className="min-w-0 lg:hidden">
          <h2 id="activity-m" className="mb-3 text-lg font-bold">
            {g.activity}
          </h2>
          <Tape events={events} gates={demo.gates} dict={dict} locale={locale} now={now} empty={g.activityEmpty} limit={7} label={g.activity} />
        </section>
      </div>
    </div>
  )
}
