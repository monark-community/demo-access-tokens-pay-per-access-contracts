"use client"

import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { NetworkBadge } from "@/components/ui/network-badge"
import { WalletAddress, WalletAvatar } from "@/components/ui/wallet"
import { useDemo, usePrompt } from "@/lib/demo/store"

import { useApp } from "./app-provider"

/**
 * The simulated wallet's signature window. Every connection and transaction
 * keys through it; closing it counts as a rejection.
 */
export function WalletPrompt() {
  const { dict } = useApp()
  const p = dict.app.prompt
  const request = usePrompt()
  const demo = useDemo()
  const open = request !== null
  const operator = request?.summary?.signer === "operator"
  const address = operator ? demo?.operator.address : demo?.wallet.address

  return (
    <Dialog open={open} onOpenChange={(o) => !o && request?.resolve(false)}>
      <DialogContent className="gap-0 p-0 sm:max-w-md" showCloseButton={false}>
        {request && (
          <>
            <DialogHeader className="gap-1 border-b px-5 pt-5 pb-4">
              <p className="label-mono text-muted-foreground">
                {request.kind === "connect" ? p.titleVisitor : operator ? p.titleOperator : p.titleVisitor}
              </p>
              <DialogTitle className="text-lg font-bold">
                {request.kind === "connect" ? p.connectTitle : request.summary?.title}
              </DialogTitle>
              {request.kind === "connect" && <DialogDescription>{p.connectBody}</DialogDescription>}
              {request.kind === "tx" && <DialogDescription className="sr-only">{request.summary?.title}</DialogDescription>}
            </DialogHeader>

            <dl className="divide-y divide-dashed px-5 text-sm">
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-muted-foreground">{p.signer}</dt>
                <dd className="flex min-w-0 items-center gap-2">
                  {address && <WalletAvatar address={address} size={20} />}
                  <span className="truncate font-semibold">{operator ? p.operator : p.visitor}</span>
                  {address && <WalletAddress address={address} className="hidden text-xs text-muted-foreground sm:inline" />}
                </dd>
              </div>
              {request.summary?.lines.map((l) => (
                <div key={l.label} className="flex items-start justify-between gap-4 py-3">
                  <dt className="shrink-0 text-muted-foreground">{l.label}</dt>
                  <dd className="min-w-0 text-right font-mono text-[0.82rem] font-medium break-words">{l.value}</dd>
                </div>
              ))}
              {request.kind === "tx" && (
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-muted-foreground">{p.fee}</dt>
                  <dd className="font-mono text-[0.82rem]">{p.feeValue}</dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-muted-foreground">{p.network}</dt>
                <dd>
                  <NetworkBadge name={p.networkName} variant="outline" icon={<span className="block size-full bg-primary" />} />
                </dd>
              </div>
            </dl>

            {request.summary?.movesValue && (
              <p className="mx-5 mt-1 flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                <ShieldAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                {dict.common.testnet}
              </p>
            )}

            <DialogFooter className="mt-4 flex-row gap-2 border-t px-5 py-4 sm:justify-end">
              <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => request.resolve(false)}>
                {p.reject}
              </Button>
              <Button className="flex-1 sm:flex-none" onClick={() => request.resolve(true)} autoFocus>
                {request.kind === "connect" ? p.connectApprove : p.approve}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
