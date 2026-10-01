"use client"

import { TokenAmount } from "@/components/ui/token-amount"
import { intlLocale } from "@/i18n/config"
import { TOKENS, toBaseUnits } from "@/lib/demo/tokens"
import type { TokenSymbol } from "@/lib/demo/types"

import { useApp } from "./app-provider"

/** Every on-screen amount goes through @monark/token-amount. */
export function Amount({
  value,
  token,
  usd = false,
  className,
}: {
  value: number
  token: TokenSymbol
  usd?: boolean
  className?: string
}) {
  const { locale } = useApp()
  const meta = TOKENS[token]
  return (
    <TokenAmount
      value={toBaseUnits(value, token)}
      decimals={meta.decimals}
      symbol={token}
      fractionDigits={meta.display}
      locale={intlLocale[locale]}
      usdValue={usd ? value * meta.usd : undefined}
      className={className}
    />
  )
}
