"use client"

import { Loader2, Wallet } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { connectWallet } from "@/lib/demo/ops"
import { useDemo } from "@/lib/demo/store"
import { cn } from "@/lib/utils"

import { useApp } from "./app-provider"

/** The wallet gate: connect (approve/reject in the simulated wallet), with the rejected state. */
export function ConnectCard({ className, compact }: { className?: string; compact?: boolean }) {
  const { dict } = useApp()
  const w = dict.app.wallet
  const demo = useDemo()
  const [rejected, setRejected] = useState(false)
  const connecting = demo?.wallet.status === "connecting"

  async function connect() {
    setRejected(false)
    const result = await connectWallet()
    if (result === "rejected") setRejected(true)
  }

  return (
    <div className={cn("rounded-lg border border-dashed border-foreground/30 bg-card p-5 sm:p-6", className)}>
      <div className={cn("flex gap-4", compact ? "flex-col" : "flex-col sm:flex-row sm:items-center sm:justify-between")}>
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-muted">
            <Wallet className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-bold">{w.gateTitle}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{w.gateBody}</p>
          </div>
        </div>
        <Button onClick={connect} disabled={connecting} className="shrink-0">
          {connecting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Wallet aria-hidden="true" />}
          {connecting ? w.connecting : w.connect}
        </Button>
      </div>
      {rejected && (
        <p role="alert" className="mt-4 rounded-md bg-destructive/5 px-3 py-2 text-sm font-semibold text-destructive">
          {w.rejected}
        </p>
      )}
    </div>
  )
}
