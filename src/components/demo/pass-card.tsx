"use client"

import { PassStub } from "@/components/pass/stub"
import { t } from "@/i18n/t"
import { passState, remainingShare } from "@/lib/demo/rules"
import type { Gate, Pass } from "@/lib/demo/types"

import { useApp } from "./app-provider"
import { stubText } from "./gate-text"

/** A PassStub bound to a live pass: counts down with the demo clock. */
export function PassCard({
  pass,
  gate,
  now,
  punched,
  hole,
  className,
  headingLevel,
}: {
  pass: Pass
  gate: Gate
  now: number
  punched?: boolean
  hole?: "background" | "card"
  className?: string
  headingLevel?: 2 | 3 | 4
}) {
  const { dict, locale } = useApp()
  const state = passState(pass, now)
  const text = stubText(pass, gate, state, now, dict, locale)
  return (
    <PassStub
      kind={gate.kind}
      kindLabel={dict.modes[gate.rule.mode]}
      title={gate.title}
      place={gate.place}
      code={pass.code}
      serial={t(dict.app.stub.token, { id: pass.tokenId })}
      remaining={text.remaining}
      remainingLabel={text.remainingLabel}
      caption={text.caption}
      share={remainingShare(pass, now)}
      meterLabel={pass.usesLeft !== null ? dict.app.stub.meterUses : dict.app.stub.meterTime}
      state={state}
      stamp={text.stamp}
      punched={punched}
      hole={hole}
      className={className}
      headingLevel={headingLevel}
    />
  )
}
