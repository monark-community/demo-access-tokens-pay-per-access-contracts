"use client"

import { Minus, Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { t } from "@/i18n/t"
import { applyPurchase, topUp } from "@/lib/demo/ops"
import { ownerOf } from "@/lib/demo/rules"
import { useDemo } from "@/lib/demo/store"
import { roundToken } from "@/lib/demo/tokens"
import type { Gate, AccessKey } from "@/lib/demo/types"
import { useTx } from "@/lib/demo/use-tx"
import { formatAmount, formatUnits, shortAddress } from "@/lib/format"
import { cn } from "@/lib/utils"

import { Amount } from "./amount"
import { useApp } from "./app-provider"
import { ConnectCard } from "./connect-card"
import { TxFeedback } from "./tx-feedback"

/**
 * Buy (or renew) a key: units, total, balance, the wallet prompt, and the
 * pending / confirmed / failed / rejected states inline.
 */
export function BuyPanel({
  gate,
  renew,
  onDone,
  className,
}: {
  gate: Gate
  renew?: AccessKey
  onDone?: (code: string, renewed: boolean) => void
  className?: string
}) {
  const { dict, locale } = useApp()
  const g = dict.app.gate
  const demo = useDemo()
  const tx = useTx()
  const [units, setUnits] = useState(1)
  const rule = gate.rule

  if (!demo) return null
  if (demo.wallet.status !== "connected") return <ConnectCard compact className={className} />

  const balance = demo.wallet.balances[rule.token]
  const total = roundToken(units * rule.price, rule.token)
  const insufficient = total > balance
  const paused = gate.status === "paused" && !renew
  const owner = ownerOf(demo.owners, gate)
  const bought = rule.mode === "forever" ? g.lineGetForever : formatUnits(rule, gate.kind, units, dict.units)

  async function pay() {
    const summary = {
      signer: "visitor" as const,
      title: t(renew ? g.promptRenew : g.promptBuy, { gate: gate.title }),
      movesValue: true,
      lines: [
        { label: g.linePay, value: formatAmount(total, rule.token, locale) },
        { label: g.lineTo, value: `${owner.name} · ${shortAddress(gate.contract)}` },
        { label: g.lineGet, value: renew ? `+ ${bought} · ${renew.code}` : bought },
      ],
    }
    await tx.run(summary, (r) => {
      const code = applyPurchase(gate.id, units, r, renew?.code)
      if (code) onDone?.(code, Boolean(renew))
    })
  }

  return (
    <div id="buy" className={cn("scroll-mt-24 rounded-lg border bg-card p-5", className)}>
      <h2 className="text-lg font-bold">{renew ? g.renewTitle : g.buyTitle}</h2>

      {paused ? (
        <p className="mt-3 rounded-md bg-muted p-3 text-sm text-muted-foreground">{g.pausedBody}</p>
      ) : (
        <>
          {rule.maxUnits > 1 && (
            <div className="mt-4">
              <p id={`units-${gate.id}`} className="text-sm font-semibold">
                {g.units}
              </p>
              <div className="mt-2 flex items-center gap-3" role="group" aria-labelledby={`units-${gate.id}`}>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={g.decrease}
                  disabled={units <= 1 || tx.busy}
                  onClick={() => setUnits((u) => Math.max(1, u - 1))}
                >
                  <Minus aria-hidden="true" />
                </Button>
                <output aria-live="polite" className="min-w-24 text-center font-mono text-lg font-semibold tabular-nums">
                  {formatUnits(rule, gate.kind, units, dict.units)}
                </output>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={g.increase}
                  disabled={units >= rule.maxUnits || tx.busy}
                  onClick={() => setUnits((u) => Math.min(rule.maxUnits, u + 1))}
                >
                  <Plus aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}

          <dl className="mt-4 divide-y divide-dashed rounded-md border text-sm">
            <div className="flex items-center justify-between gap-3 px-3 py-2.5">
              <dt className="font-semibold">{g.total}</dt>
              <dd>
                <Amount value={total} token={rule.token} usd className="items-end text-base font-bold" />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 px-3 py-2.5">
              <dt className="text-muted-foreground">{g.balance}</dt>
              <dd>
                <Amount value={balance} token={rule.token} />
              </dd>
            </div>
            {!insufficient && (
              <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                <dt className="text-muted-foreground">{g.after}</dt>
                <dd>
                  <Amount value={roundToken(balance - total, rule.token)} token={rule.token} />
                </dd>
              </div>
            )}
          </dl>

          {insufficient && (
            <div role="alert" className="mt-3 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
              <p className="font-semibold text-destructive">
                {t(g.insufficient, {
                  token: rule.token,
                  have: formatAmount(balance, rule.token, locale),
                  need: formatAmount(total, rule.token, locale),
                })}
              </p>
              <Button variant="link" size="sm" className="mt-1" onClick={() => topUp(rule.token, 50)}>
                {t(g.topUp, { token: rule.token })}
              </Button>
            </div>
          )}

          <Button size="lg" className="mt-4 w-full" disabled={insufficient || tx.busy} onClick={pay}>
            {t(g.pay, { amount: formatAmount(total, rule.token, locale) })}
          </Button>
          <TxFeedback
            tx={tx}
            onRetry={pay}
            success={tx.phase === "confirmed" ? (renew ? g.renewed : g.purchased) : undefined}
            className="mt-4"
          />
        </>
      )}
    </div>
  )
}
