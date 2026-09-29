"use client"

/* @monark/connect-wallet (https://ui.monark.io/r/connect-wallet.json), installed by
   hand because the CLI resolves its `wallet` dependency against the default
   registry. Re-themed for GatePay (6px radius, ink border). */

import * as React from "react"
import { ChevronDownIcon, Loader2Icon, LogOutIcon, Wallet as WalletIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletAddress, WalletAvatar } from "@/components/ui/wallet"

type ConnectWalletStatus = "disconnected" | "connecting" | "connected"

function ConnectWallet({
  status = "disconnected",
  address,
  name,
  onConnect,
  onDisconnect,
  connectLabel = "Connect wallet",
  connectingLabel = "Connecting…",
  disconnectLabel = "Disconnect",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick" | "children" | "disabled"> & {
  status?: ConnectWalletStatus
  address?: string
  name?: string
  onConnect?: () => void
  onDisconnect?: () => void
  connectLabel?: React.ReactNode
  connectingLabel?: React.ReactNode
  disconnectLabel?: React.ReactNode
}) {
  if (status === "connecting") {
    return (
      <Button disabled className={className} {...props}>
        <Loader2Icon className="size-4 animate-spin" />
        {connectingLabel}
      </Button>
    )
  }

  if (status === "connected" && address) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            data-slot="connect-wallet-trigger"
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-md border border-foreground/20 bg-card py-1 pr-2 pl-1 text-card-foreground outline-hidden transition-colors hover:border-foreground/50 focus-visible:ring-[3px] focus-visible:ring-ring/60",
              className
            )}
          >
            <WalletAvatar address={address} size={28} />
            <span className="flex min-w-0 flex-col text-left leading-tight">
              {name && <span className="truncate text-xs font-semibold">{name}</span>}
              <WalletAddress address={address} className="text-[0.7rem] text-muted-foreground" />
            </span>
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onDisconnect}>
            <LogOutIcon className="size-4" aria-hidden="true" />
            {disconnectLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={onConnect} className={className} {...props}>
      <WalletIcon className="size-4" aria-hidden="true" />
      {connectLabel}
    </Button>
  )
}

export { ConnectWallet }
export type { ConnectWalletStatus }
