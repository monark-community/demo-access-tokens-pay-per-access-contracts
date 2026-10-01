"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"

import type { Locale } from "@/i18n/config"
import type { AppDict } from "@/i18n/dictionaries/en"
import { sweepExpiries } from "@/lib/demo/ops"
import { initDemo } from "@/lib/demo/store"

import { WalletPrompt } from "./wallet-prompt"

interface AppContextValue {
  dict: AppDict
  locale: Locale
}

const AppContext = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>")
  return ctx
}

/** Loads (or seeds) the demo, writes expiries to the tape, and hosts the wallet prompt. */
export function AppProvider({ dict, locale, children }: { dict: AppDict; locale: Locale; children: ReactNode }) {
  useEffect(() => {
    initDemo(dict.seed, locale)
    sweepExpiries()
    const id = window.setInterval(sweepExpiries, 1000)
    return () => window.clearInterval(id)
  }, [dict.seed, locale])

  return (
    <AppContext.Provider value={{ dict, locale }}>
      {children}
      <WalletPrompt />
    </AppContext.Provider>
  )
}
