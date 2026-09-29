"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"
import { toast } from "sonner"

import { KindIcon } from "@/components/pass/kind-icon"
import { PassStub } from "@/components/pass/stub"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { href } from "@/i18n/config"
import { t } from "@/i18n/t"
import { applyPublish, type GateDraft } from "@/lib/demo/ops"
import { KINDS } from "@/lib/demo/rules"
import { TOKEN_LIST } from "@/lib/demo/tokens"
import type { AccessMode, GateKind, Rule, TokenSymbol } from "@/lib/demo/types"
import { useTx } from "@/lib/demo/use-tx"
import { formatAmount, formatUnits } from "@/lib/format"
import { cn } from "@/lib/utils"

import { useApp } from "./app-provider"
import { ruleSentence } from "./gate-text"
import { PageHead } from "./page-head"
import { TxFeedback } from "./tx-feedback"

type DurationUnit = "minutes" | "hours" | "days"
const UNIT_MIN: Record<DurationUnit, number> = { minutes: 1, hours: 60, days: 1440 }
const DEVICE: GateKind[] = ["room", "locker"]

interface Form {
  kind: GateKind
  title: string
  place: string
  description: string
  mode: AccessMode
  duration: string
  durationUnit: DurationUnit
  uses: string
  price: string
  token: TokenSymbol
  maxUnits: string
  webhook: string
}

type Errors = Partial<Record<"title" | "place" | "price" | "duration" | "uses" | "maxUnits" | "webhook", string>>

function toRule(f: Form): Rule {
  const price = Number(f.price)
  const maxUnits = f.mode === "forever" ? 1 : Math.round(Number(f.maxUnits))
  if (f.mode === "time") return { mode: "time", price, token: f.token, unitMinutes: Math.round(Number(f.duration) * UNIT_MIN[f.durationUnit]), maxUnits }
  if (f.mode === "uses") return { mode: "uses", price, token: f.token, usesPerUnit: Math.round(Number(f.uses)), maxUnits }
  return { mode: "forever", price, token: f.token, maxUnits: 1 }
}

/** Publish a gate: kind, words, the rule, the gateway action, and a live preview of the stub. */
export function Composer() {
  const { dict, locale } = useApp()
  const c = dict.app.composer
  const e = c.errors
  const router = useRouter()
  const tx = useTx()
  const [form, setForm] = useState<Form>({
    kind: "room",
    title: "",
    place: "",
    description: "",
    mode: "time",
    duration: "1",
    durationUnit: "hours",
    uses: "5",
    price: "10",
    token: "tUSDC",
    maxUnits: "4",
    webhook: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  function validate(f: Form): Errors {
    const out: Errors = {}
    if (!f.title.trim()) out.title = e.title
    else if (f.title.trim().length > 60) out.title = e.titleLong
    if (!f.place.trim()) out.place = e.place
    if (!(Number(f.price) > 0)) out.price = e.price
    if (f.mode === "time" && !(Number(f.duration) > 0)) out.duration = e.duration
    if (f.mode === "uses" && !(Number(f.uses) >= 1)) out.uses = e.uses
    const mu = Number(f.maxUnits)
    if (f.mode !== "forever" && !(Number.isInteger(mu) && mu >= 1 && mu <= 12)) out.maxUnits = e.maxUnits
    if (DEVICE.includes(f.kind) && !/^https:\/\/[^\s/]+\.[^\s]+/.test(f.webhook.trim())) out.webhook = e.webhook
    return out
  }

  // Errors show after the first publish attempt, then update as the operator types.
  const shownErrors: Errors = submitted ? validate(form) : {}
  const rule = toRule(form)
  const previewOk = !validate({ ...form, title: form.title || "x", place: form.place || "x", webhook: DEVICE.includes(form.kind) ? "https://x.y" : "" }).price

  async function publish() {
    setSubmitted(true)
    const found = validate(form)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      window.setTimeout(() => document.getElementById(`f-${first}`)?.focus(), 0)
      return
    }
    const draft: GateDraft = {
      kind: form.kind,
      title: form.title.trim(),
      place: form.place.trim(),
      description: form.description.trim(),
      rule,
      webhookUrl: DEVICE.includes(form.kind) ? form.webhook.trim() : undefined,
    }
    let newId = ""
    const ok = await tx.run(
      {
        signer: "operator",
        title: t(c.promptTitle, { gate: draft.title }),
        movesValue: false,
        lines: [
          { label: c.lineRule, value: ruleSentence({ rule, kind: form.kind }, dict, locale) },
          ...(draft.webhookUrl ? [{ label: c.webhook, value: draft.webhookUrl }] : []),
        ],
      },
      (r) => {
        newId = applyPublish(draft, r)
      }
    )
    if (ok && newId) {
      toast.success(t(dict.app.console.published, { gate: draft.title }))
      window.setTimeout(() => router.push(href(locale, "/app/console")), 900)
    }
  }

  const field = (id: keyof Errors) => ({
    id: `f-${id}`,
    "aria-invalid": shownErrors[id] ? true : undefined,
    "aria-describedby": shownErrors[id] ? `f-${id}-err` : undefined,
  })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8">
      <Link
        href={href(locale, "/app/console")}
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {dict.app.console.title}
      </Link>
      <div className="mt-4">
        <PageHead seat={dict.app.seats.console} title={c.title} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form
          noValidate
          onSubmit={(ev) => {
            ev.preventDefault()
            void publish()
          }}
          className="flex flex-col gap-8"
        >
          <fieldset>
            <legend className="text-lg font-bold">{c.kind}</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {KINDS.map((k) => (
                <label
                  key={k}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-md border p-3 text-sm font-semibold transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60",
                    form.kind === k ? "border-foreground bg-foreground text-background" : "border-foreground/20 bg-card hover:border-foreground/50"
                  )}
                >
                  <input type="radio" name="kind" value={k} checked={form.kind === k} onChange={() => set("kind", k)} className="sr-only" />
                  <KindIcon kind={k} className="size-4" />
                  {dict.kinds[k]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={c.name} error={shownErrors.title} id="title" className="sm:col-span-2">
              <Input {...field("title")} value={form.title} onChange={(ev) => set("title", ev.target.value)} placeholder={c.namePlaceholder} maxLength={80} />
            </Field>
            <Field label={c.place} error={shownErrors.place} id="place" className="sm:col-span-2">
              <Input {...field("place")} value={form.place} onChange={(ev) => set("place", ev.target.value)} placeholder={c.placePlaceholder} maxLength={80} />
            </Field>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="f-description">{c.description}</Label>
              <textarea
                id="f-description"
                rows={3}
                maxLength={220}
                value={form.description}
                onChange={(ev) => set("description", ev.target.value)}
                placeholder={c.descriptionPlaceholder}
                className="w-full resize-none rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
              />
            </div>
          </div>

          <fieldset className="rounded-lg border bg-card p-5">
            <legend className="px-1 text-lg font-bold">{c.rule}</legend>
            <p id="mode-label" className="text-sm font-semibold">
              {c.mode}
            </p>
            <div role="radiogroup" aria-labelledby="mode-label" className="mt-2 grid grid-cols-3 gap-1 rounded-md bg-muted p-1">
              {(["time", "uses", "forever"] as const).map((m) => (
                <label
                  key={m}
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-[4px] px-2 py-2 text-center text-sm font-semibold transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60",
                    form.mode === m ? "bg-card text-foreground ring-1 ring-foreground/25" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <input type="radio" name="mode" value={m} checked={form.mode === m} onChange={() => set("mode", m)} className="sr-only" />
                  {dict.modes[m]}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{c.modeHelp[form.mode]}</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {form.mode === "time" && (
                <>
                  <Field label={c.duration} error={shownErrors.duration} id="duration">
                    <Input {...field("duration")} type="number" inputMode="numeric" min={1} value={form.duration} onChange={(ev) => set("duration", ev.target.value)} />
                  </Field>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="f-unit">{c.durationUnit}</Label>
                    <Select value={form.durationUnit} onValueChange={(v) => set("durationUnit", v as DurationUnit)}>
                      <SelectTrigger id="f-unit" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["minutes", "hours", "days"] as const).map((u) => (
                          <SelectItem key={u} value={u}>
                            {c.unitOptions[u]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {form.mode === "uses" && (
                <Field label={c.usesLabel} error={shownErrors.uses} id="uses" className="sm:col-span-2">
                  <Input {...field("uses")} type="number" inputMode="numeric" min={1} value={form.uses} onChange={(ev) => set("uses", ev.target.value)} />
                </Field>
              )}
              <Field label={c.price} error={shownErrors.price} id="price">
                <Input {...field("price")} type="number" inputMode="decimal" min={0} step="0.01" value={form.price} onChange={(ev) => set("price", ev.target.value)} />
              </Field>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="f-token">{c.token}</Label>
                <Select value={form.token} onValueChange={(v) => set("token", v as TokenSymbol)}>
                  <SelectTrigger id="f-token" className="w-full font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TOKEN_LIST.map((tk) => (
                      <SelectItem key={tk} value={tk} className="font-mono">
                        {tk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.mode !== "forever" && (
                <Field label={c.maxUnits} error={shownErrors.maxUnits} id="maxUnits">
                  <Input {...field("maxUnits")} type="number" inputMode="numeric" min={1} max={12} value={form.maxUnits} onChange={(ev) => set("maxUnits", ev.target.value)} />
                </Field>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-lg font-bold">{c.action}</legend>
            <p className="mt-2 flex items-center gap-2 text-sm">
              <KindIcon kind={form.kind} className="size-4 text-primary" />
              {c.actions[form.kind]}
            </p>
            {DEVICE.includes(form.kind) && (
              <Field label={c.webhook} error={shownErrors.webhook} id="webhook" className="mt-4" help={c.webhookHelp}>
                <Input
                  {...field("webhook")}
                  type="url"
                  inputMode="url"
                  value={form.webhook}
                  onChange={(ev) => set("webhook", ev.target.value)}
                  placeholder="https://hooks.harbourstreet.works/studio-c/unlock"
                  className="font-mono text-sm"
                />
              </Field>
            )}
          </fieldset>

          {submitted && Object.keys(shownErrors).length > 0 && (
            <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm font-semibold text-destructive">
              {e.summary}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Button type="submit" size="lg" disabled={tx.busy || tx.phase === "confirmed"}>
                {c.publish}
              </Button>
              <Button asChild type="button" size="lg" variant="ghost">
                <Link href={href(locale, "/app/console")}>{c.cancel}</Link>
              </Button>
            </div>
            <TxFeedback tx={tx} onRetry={() => void publish()} />
          </div>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-labelledby="preview">
          <h2 id="preview" className="label-mono text-muted-foreground">
            {c.preview}
          </h2>
          <div className="mt-3">
            <PassStub
              kind={form.kind}
              kindLabel={dict.modes[form.mode]}
              title={form.title.trim() || c.namePlaceholder}
              place={form.place.trim() || c.placePlaceholder}
              code="GP-····-··"
              remaining={
                form.mode === "forever"
                  ? "∞"
                  : form.mode === "uses"
                    ? `${Math.max(0, Math.round(Number(form.uses) || 0))} / ${Math.max(0, Math.round(Number(form.uses) || 0))}`
                    : formatUnits(rule, form.kind, 1, dict.units) || "—"
              }
              remainingLabel={form.mode === "forever" ? dict.modes.forever : dict.app.stub.left}
              caption={previewOk ? formatAmount(rule.price, rule.token, locale) : "—"}
              share={1}
              meterLabel={dict.app.stub.preview}
              state={form.mode === "forever" ? "forever" : "active"}
            />
          </div>
          <p className="mt-4 rounded-md bg-stub p-3 text-sm font-semibold text-stub-foreground">
            {previewOk ? ruleSentence({ rule, kind: form.kind }, dict, locale) : "—"}
          </p>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  id,
  children,
  className,
  help,
}: {
  label: string
  error?: string
  id: string
  children: ReactNode
  className?: string
  help?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={`f-${id}`}>{label}</Label>
      {children}
      {help && !error && <p className="text-xs text-muted-foreground">{help}</p>}
      {error && (
        <p id={`f-${id}-err`} className="text-xs font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
