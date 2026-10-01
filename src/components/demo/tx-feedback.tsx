"use client"

import { Loader2, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TxStatus } from "@/components/ui/tx-status"
import { t } from "@/i18n/t"
import { formatNumber } from "@/lib/format"
import type { TxView } from "@/lib/demo/use-tx"
import { cn } from "@/lib/utils"

import { useApp } from "./app-provider"

/** Inline transaction state, next to the action that started it (never a toast). */
export function TxFeedback({
  tx,
  onRetry,
  success,
  className,
}: {
  tx: TxView
  onRetry?: () => void
  success?: string
  className?: string
}) {
  const { dict, locale } = useApp()
  const x = dict.app.tx
  if (tx.phase === "idle") return null

  return (
    <div className={cn("text-sm", className)} role={tx.phase === "failed" ? "alert" : "status"} aria-live="polite">
      {tx.phase === "signing" && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {x.signing}
        </p>
      )}
      {tx.phase === "pending" && tx.hash && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <TxStatus status="pending" hash={tx.hash} label={x.pendingLabel} />
          <span className="text-muted-foreground">{x.pending}</span>
        </div>
      )}
      {tx.phase === "confirmed" && tx.hash && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <TxStatus status="confirmed" hash={tx.hash} label={x.confirmedLabel} />
          <span className="text-muted-foreground">
            {t(x.confirmed, { block: formatNumber(tx.block ?? 0, locale) })}
            {success && <span className="block font-semibold text-foreground">{success}</span>}
          </span>
        </div>
      )}
      {tx.phase === "failed" && (
        <div className="flex flex-col gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-3">
          {tx.hash && <TxStatus status="failed" hash={tx.hash} label={x.failedLabel} className="self-start" />}
          <p className="font-semibold text-destructive">{x.failed}</p>
          {onRetry && (
            <Button variant="outline" size="sm" className="self-start" onClick={onRetry}>
              <RotateCcw aria-hidden="true" />
              {x.retry}
            </Button>
          )}
        </div>
      )}
      {tx.phase === "rejected" && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-muted-foreground">{x.rejected}</p>
          {onRetry && (
            <Button variant="link" size="sm" onClick={onRetry}>
              {x.retry}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
