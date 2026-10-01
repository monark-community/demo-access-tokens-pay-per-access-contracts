"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { KindIcon } from "@/components/key/kind-icon"
import { Plate } from "@/components/key/plate"
import { Tape } from "@/components/key/tape"
import { Button } from "@/components/ui/button"
import { href } from "@/i18n/config"
import { bestKey, ownerOf, surfaceOf } from "@/lib/demo/rules"
import { useDemo, useNow } from "@/lib/demo/store"
import type { AccessKey, DemoState, Gate } from "@/lib/demo/types"
import { shortAddress } from "@/lib/format"

import { Access } from "./access"
import { useApp } from "./app-provider"
import { GateCarousel } from "./gate-carousel"
import { ViewSkeleton } from "./keys-view"
import { OwnerAvatar } from "./owner-avatar"
import { UnlockPanel } from "./unlock-panel"
import { isOpen, useUnlock } from "./use-unlock"

export function GateView({ id }: { id: string }) {
  const { dict, locale } = useApp()
  const g = dict.app.gate
  const demo = useDemo()
  const now = useNow()

  if (!demo || !now) return <ViewSkeleton />
  const gate = demo.gates.find((x) => x.id === id)
  if (!gate) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">{g.notFoundTitle}</h1>
        <p className="mt-3 text-muted-foreground">{g.notFoundBody}</p>
        <Button asChild className="mt-6">
          <Link href={href(locale, "/app")}>{g.back}</Link>
        </Button>
      </div>
    )
  }

  const connected = demo.wallet.status === "connected"
  const key = connected ? bestKey(demo.keys, gate.id, demo.wallet.address, now) : undefined
  return <GatePage key={gate.id} gate={gate} demo={demo} accessKey={key} connected={connected} now={now} />
}

/** One gate: what you're unlocking (left), the Unlock action (right), and what's behind it. */
function GatePage({
  gate,
  demo,
  accessKey: key,
  connected,
  now,
}: {
  gate: Gate
  demo: DemoState
  accessKey: AccessKey | undefined
  connected: boolean
  now: number
}) {
  const { dict, locale } = useApp()
  const g = dict.app.gate
  const unlock = useUnlock(gate, key, now)
  const owner = ownerOf(demo.owners, gate)
  const surface = surfaceOf(gate.kind)
  const events = demo.log.filter((e) => e.gateId === gate.id)
  // The plate tells the gate's state, not the key's: open only while it is unlocked.
  const plate = isOpen(unlock, surface, now) ? "open" : gate.status === "paused" ? "paused" : "locked"

  const activity = (idSuffix: string) => (
    <>
      <h2 id={`activity${idSuffix}`} className="mb-3 text-lg font-bold">
        {g.activity}
      </h2>
      <Tape events={events} gates={demo.gates} dict={dict} locale={locale} now={now} empty={g.activityEmpty} limit={5} more={dict.common.showMore} label={g.activity} />
    </>
  )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8">
      <Link
        href={href(locale, "/app")}
        className="inline-flex items-center gap-1.5 rounded-sm font-mono text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {g.back}
      </Link>

      {/* Phones read: the gate, Unlock, what's behind it, activity. Desktop: gate + reveal left, Unlock sticky right. */}
      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-x-8">
        <section aria-labelledby="gate-title" className="min-w-0 overflow-hidden rounded-lg border bg-card lg:col-start-1 lg:row-start-1">
          <GateCarousel gate={gate}>
            <Plate state={plate} label={dict.app.plate[plate]} className="pointer-events-none absolute top-3 left-3" />
            <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 font-mono text-[0.68rem] font-semibold tracking-[0.1em] uppercase">
              {dict.surfaces[surface]}
            </span>
          </GateCarousel>
          <div className="flex flex-col gap-2 p-5">
            <p className="label-mono flex items-center gap-1.5 text-muted-foreground">
              <KindIcon kind={gate.kind} className="size-3.5" />
              {dict.kinds[gate.kind]} · {dict.modes[gate.rule.mode]}
            </p>
            <h1 id="gate-title" className="text-2xl leading-tight font-extrabold sm:text-3xl">
              {gate.title}
            </h1>
            <p className="text-sm text-muted-foreground">{gate.place}</p>
            <p className="mt-1 max-w-prose text-[0.95rem]">{gate.description}</p>
            <div className="mt-3 flex items-center gap-3 border-t pt-4">
              <OwnerAvatar owner={owner} />
              <div className="min-w-0 flex-1">
                <p className="label-mono text-muted-foreground">{g.youPay}</p>
                <p className="truncate font-semibold">{owner.name}</p>
              </div>
              <p className="hidden text-right font-mono text-xs text-muted-foreground sm:block">
                {shortAddress(owner.address)}
                <span className="block">
                  {g.contract} {shortAddress(gate.contract)}
                </span>
              </p>
            </div>
          </div>
        </section>

        <div className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-20 lg:col-start-2 lg:row-span-3 lg:row-start-1">
          <UnlockPanel gate={gate} accessKey={key} unlock={unlock} connected={connected} balance={demo.wallet.balances[gate.rule.token]} now={now} />
          <section aria-labelledby="activity" className="hidden lg:block">
            {activity("")}
          </section>
        </div>

        <section id="access" aria-labelledby="access-title" className="min-w-0 scroll-mt-24 rounded-lg border bg-card p-5 lg:col-start-1 lg:row-start-2">
          <h2 id="access-title" className="mb-4 text-lg font-bold">
            {g.access}
          </h2>
          <Access gate={gate} unlock={unlock} now={now} />
        </section>

        <section aria-labelledby="activity-m" className="min-w-0 lg:hidden">
          {activity("-m")}
        </section>
      </div>
    </div>
  )
}
