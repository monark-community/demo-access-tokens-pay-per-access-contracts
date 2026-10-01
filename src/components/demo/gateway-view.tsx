"use client"

import { Loader2, ScanLine } from "lucide-react"
import { useState } from "react"

import { Plate } from "@/components/key/plate"
import { Tape } from "@/components/key/tape"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InfoTip } from "@/components/ui/info-tip"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WalletAddress } from "@/components/ui/wallet"
import { t } from "@/i18n/t"
import { checkKey, type CheckResult } from "@/lib/demo/ops"
import { useDemo, useNow } from "@/lib/demo/store"
import { formatDateTime, formatNumber, formatUses } from "@/lib/format"
import { cn } from "@/lib/utils"

import { useApp } from "./app-provider"
import { PageHead } from "./page-head"
import { ViewSkeleton } from "./keys-view"

export function GatewayView() {
  const { dict, locale } = useApp()
  const w = dict.app.gateway
  const demo = useDemo()
  const now = useNow()
  const [gateId, setGateId] = useState("studio-b")
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState(false)
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [filter, setFilter] = useState("all")

  if (!demo || !now) return <ViewSkeleton />

  const gate = demo.gates.find((g) => g.id === gateId) ?? demo.gates[0]
  const recent = gate
    ? demo.keys
        .filter((p) => p.gateId === gate.id)
        .sort((a, b) => b.purchasedAt - a.purchasedAt)
        .slice(0, 5)
    : []
  const events = demo.log.filter((e) => filter === "all" || e.gateId === filter)

  async function check() {
    if (!gate) return
    if (!code.trim()) {
      setCodeError(true)
      return
    }
    setCodeError(false)
    setChecking(true)
    setResult(null)
    const r = await checkKey(gate.id, code, { consume: false })
    setResult(r)
    setChecking(false)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-10">
      <PageHead
        seat={dict.app.seats.gateway}
        title={w.title}
        info={
          <InfoTip label={w.aboutLabel}>
            <p>{w.about}</p>
          </InfoTip>
        }
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)]">
        <section aria-labelledby="check" className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border bg-card p-5">
            <h2 id="check" className="flex items-center gap-2 text-lg font-bold">
              <ScanLine className="size-5 text-primary" aria-hidden="true" />
              {w.checkTitle}
            </h2>
            <form
              className="mt-4 flex flex-col gap-4"
              onSubmit={(ev) => {
                ev.preventDefault()
                void check()
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gw-gate">{w.gate}</Label>
                <Select
                  value={gate?.id}
                  onValueChange={(v) => {
                    setGateId(v)
                    setResult(null)
                  }}
                >
                  <SelectTrigger id="gw-gate" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {demo.gates.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gw-code">{w.code}</Label>
                <Input
                  id="gw-code"
                  value={code}
                  onChange={(ev) => setCode(ev.target.value)}
                  placeholder={w.codePlaceholder}
                  autoComplete="off"
                  spellCheck={false}
                  className="font-mono uppercase"
                  aria-invalid={codeError || undefined}
                  aria-describedby={codeError ? "gw-code-err" : undefined}
                />
                {codeError && (
                  <p id="gw-code-err" className="text-xs font-semibold text-destructive">
                    {w.codeRequired}
                  </p>
                )}
              </div>
              {recent.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">{w.recent}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {recent.map((p) => (
                      <button
                        key={p.code}
                        type="button"
                        onClick={() => {
                          setCode(p.code)
                          setCodeError(false)
                        }}
                        className={cn(
                          "h-8 rounded-sm border border-dashed px-2 font-mono text-xs transition-colors hover:border-foreground/60 focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none",
                          code === p.code && "border-solid border-foreground bg-muted"
                        )}
                      >
                        {p.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Button type="submit" size="lg" disabled={checking}>
                {checking ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ScanLine aria-hidden="true" />}
                {checking ? w.checking : w.check}
              </Button>
            </form>
          </div>

          <div aria-live="polite">
            {result && gate && (
              <div
                className={cn(
                  "gp-rise rounded-lg border-2 bg-card p-5",
                  result.ok ? "border-primary" : "border-destructive"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className={cn("text-xl font-extrabold", result.ok ? "text-primary" : "text-destructive")}>
                    {result.ok ? w.granted : w.denied}
                  </p>
                  <Plate state={result.ok ? "open" : "locked"} label={result.ok ? dict.app.plate.open : dict.app.plate.locked} />
                </div>
                {!result.ok && (
                  <p className="mt-2 text-sm font-semibold">
                    {result.reason === "expired" && result.key?.expiresAt
                      ? t(dict.app.use.denied.expired, { date: formatDateTime(result.key.expiresAt, locale) })
                      : dict.app.use.denied[result.reason]}
                  </p>
                )}
                <dl className="mt-4 divide-y divide-dashed text-sm">
                  {result.key && (
                    <>
                      <div className="flex justify-between gap-3 py-2">
                        <dt className="text-muted-foreground">{w.facts.holder}</dt>
                        <dd>
                          <WalletAddress address={result.key.holder} className="text-xs" />
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3 py-2">
                        <dt className="text-muted-foreground">
                          {result.key.usesLeft !== null ? w.facts.uses : w.facts.ends}
                        </dt>
                        <dd className="font-mono text-xs">
                          {result.key.expiresAt !== null
                            ? formatDateTime(result.key.expiresAt, locale)
                            : result.key.usesLeft !== null
                              ? formatUses(result.key.usesLeft, gate.kind, dict.units)
                              : w.facts.forever}
                        </dd>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between gap-3 py-2">
                    <dt className="text-muted-foreground">{w.facts.block}</dt>
                    <dd className="font-mono text-xs">{formatNumber(result.block, locale)}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="tape" className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="tape" className="text-lg font-bold">
                {w.tapeTitle}
              </h2>
              <p className="font-mono text-xs text-muted-foreground">{t(w.events, { n: formatNumber(events.length, locale) })}</p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="gw-filter" className="text-sm text-muted-foreground">
                {w.filter}
              </Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger id="gw-filter" className="w-56 max-w-[60vw]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{w.allGates}</SelectItem>
                  {demo.gates.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Tape
            events={events}
            gates={demo.gates}
            dict={dict}
            locale={locale}
            now={now}
            showGate={filter === "all"}
            empty={w.tapeEmpty}
            limit={8}
            more={dict.common.showMore}
            label={w.tapeTitle}
            className="mt-4"
          />
        </section>
      </div>
    </div>
  )
}
