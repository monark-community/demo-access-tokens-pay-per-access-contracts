"use client"

import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { errorCopy } from "@/i18n/dictionaries/errors"

const STORAGE_KEY = "gatepay-demo-v1"

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname() ?? ""
  const copy = pathname.startsWith("/fr") ? errorCopy.fr : errorCopy.en

  function resetDemo() {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Storage blocked: nothing saved to clear.
    }
    window.location.reload()
  }

  return (
    <section role="alert" className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em]">{copy.title}</h1>
      <p className="mt-4 text-muted-foreground">{copy.body}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          {copy.retry}
        </Button>
        <Button size="lg" variant="outline" onClick={resetDemo}>
          {copy.reset}
        </Button>
      </div>
    </section>
  )
}
