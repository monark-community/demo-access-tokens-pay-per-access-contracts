"use client"

import { Clock, RotateCcw, SlidersHorizontal, Zap } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { t } from "@/i18n/t"
import { backToNow, fastForward, setFailNext, topUp } from "@/lib/demo/ops"
import { resetDemo, useDemo, useNow, useStorageOk } from "@/lib/demo/store"
import { formatDateTime, formatRemaining } from "@/lib/format"

import { useApp } from "./app-provider"

const HOUR = 3_600_000

/** Bend the simulation: fast-forward the clock, fail the next tx, top up, reset. */
export function DemoControls({ className }: { className?: string }) {
  const { dict, locale } = useApp()
  const c = dict.app.controls
  const demo = useDemo()
  const now = useNow()
  const storageOk = useStorageOk()
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const offset = demo?.settings.clockOffset ?? 0

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setConfirming(false)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <SlidersHorizontal aria-hidden="true" />
          {c.open}
          {(offset > 0 || demo?.settings.failNext) && <span className="size-2 rounded-full bg-primary" aria-hidden="true" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" closeLabel={dict.common.close}>
        <DialogHeader>
          <DialogTitle className="text-lg">{c.title}</DialogTitle>
          <DialogDescription>{c.intro}</DialogDescription>
        </DialogHeader>

        <section className="rounded-md border p-4" aria-labelledby="dc-clock">
          <h3 id="dc-clock" className="label-mono flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3.5" aria-hidden="true" />
            {c.clock}
          </h3>
          <p className="mt-2 font-mono text-sm font-semibold tabular-nums">
            {now ? t(c.clockNow, { time: formatDateTime(now, locale) }) : "—"}
          </p>
          {offset > 0 && (
            <p className="mt-0.5 text-xs text-primary">{t(c.clockAhead, { time: formatRemaining(offset, dict.units) })}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => fastForward(HOUR)}>
              {c.plusHour}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => fastForward(24 * HOUR)}>
              {c.plusDay}
            </Button>
            {offset > 0 && (
              <Button size="sm" variant="ghost" onClick={backToNow}>
                {c.backToNow}
              </Button>
            )}
          </div>
        </section>

        <section className="flex items-start justify-between gap-4 rounded-md border p-4">
          <div>
            <Label htmlFor="dc-fail" className="font-semibold">
              <Zap className="size-3.5 text-destructive" aria-hidden="true" />
              {c.fail}
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">{c.failHelp}</p>
          </div>
          <Switch id="dc-fail" checked={demo?.settings.failNext ?? false} onCheckedChange={(v) => setFailNext(v)} />
        </section>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              topUp("tUSDC", 50)
              toast.success(c.toppedUp)
            }}
          >
            {c.topUp}
          </Button>
          {!confirming ? (
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => setConfirming(true)}>
              <RotateCcw aria-hidden="true" />
              {c.reset}
            </Button>
          ) : null}
        </div>
        {confirming && (
          <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-3">
            <p className="text-sm font-semibold">{c.resetConfirm}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  resetDemo(dict.seed, locale)
                  setConfirming(false)
                  setOpen(false)
                  toast(c.resetDone)
                }}
              >
                {c.resetYes}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
                {c.resetNo}
              </Button>
            </div>
          </div>
        )}
        {!storageOk && <p className="text-xs text-primary">{c.storageOff}</p>}
      </DialogContent>
    </Dialog>
  )
}
