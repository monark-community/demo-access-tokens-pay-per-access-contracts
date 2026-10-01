"use client"

import { KeyFace } from "@/components/key/key-face"
import { t } from "@/i18n/t"
import { keyState, remainingShare } from "@/lib/demo/rules"
import type { AccessKey, Gate } from "@/lib/demo/types"

import { useApp } from "./app-provider"
import { stubText } from "./gate-text"

/** A KeyFace bound to a live key: counts down with the demo clock. */
export function KeyCard({
  accessKey: key,
  gate,
  now,
  minted,
  className,
  headingLevel,
}: {
  accessKey: AccessKey
  gate: Gate
  now: number
  minted?: boolean
  className?: string
  headingLevel?: 2 | 3 | 4
}) {
  const { dict, locale } = useApp()
  const state = keyState(key, now)
  const text = stubText(key, gate, state, now, dict, locale)
  return (
    <KeyFace
      kind={gate.kind}
      kindLabel={dict.modes[gate.rule.mode]}
      title={gate.title}
      place={gate.place}
      code={key.code}
      serial={t(dict.app.stub.token, { id: key.tokenId })}
      remaining={text.remaining}
      remainingLabel={text.remainingLabel}
      caption={text.caption}
      share={remainingShare(key, now)}
      meterLabel={key.usesLeft !== null ? dict.app.stub.meterUses : dict.app.stub.meterTime}
      segments={key.usesLeft !== null ? { left: key.usesLeft, total: key.usesTotal ?? key.usesLeft } : undefined}
      forever={key.expiresAt === null && key.usesLeft === null}
      state={state}
      stamp={text.stamp}
      minted={minted}
      className={className}
      headingLevel={headingLevel}
    />
  )
}
