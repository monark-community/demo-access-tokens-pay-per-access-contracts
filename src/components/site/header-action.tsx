"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/ui/connect-wallet"
import type { Dictionary } from "@/i18n/dictionaries/en"
import { connectWallet, disconnectWallet } from "@/lib/demo/ops"
import { useDemo } from "@/lib/demo/store"
import { cn } from "@/lib/utils"

/**
 * Marketing pages: "Try the demo". Inside the demo: the wallet
 * (@monark/connect-wallet), wired to the simulated wallet.
 */
export function HeaderAction({
  demoHref,
  label,
  wallet,
  className,
}: {
  demoHref: string
  label: string
  wallet: Dictionary["app"]["wallet"]
  className?: string
}) {
  const pathname = usePathname() ?? ""
  const inApp = pathname.startsWith(demoHref)
  const demo = useDemo()

  if (!inApp) {
    return (
      <Button asChild className={cn("rounded-full px-5", className)}>
        <Link href={demoHref}>{label}</Link>
      </Button>
    )
  }
  if (!demo) return <span className={cn("block h-10 w-40", className)} aria-hidden="true" />

  return (
    <ConnectWallet
      status={demo.wallet.status}
      address={demo.wallet.address}
      name={wallet.name}
      connectLabel={wallet.connect}
      connectingLabel={wallet.connecting}
      disconnectLabel={wallet.disconnect}
      onConnect={() => void connectWallet()}
      onDisconnect={disconnectWallet}
      className={className}
    />
  )
}
