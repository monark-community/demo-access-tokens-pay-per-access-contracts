import { Clapperboard, DoorOpen, FileText, Megaphone, Radio, Wrench, type LucideIcon } from "lucide-react"

import type { GateKind } from "@/lib/demo/types"

export const KIND_ICON: Record<GateKind, LucideIcon> = {
  room: DoorOpen,
  locker: Wrench,
  stream: Radio,
  video: Clapperboard,
  document: FileText,
  board: Megaphone,
}

export function KindIcon({ kind, className }: { kind: GateKind; className?: string }) {
  const Icon = KIND_ICON[kind]
  return <Icon className={className} aria-hidden="true" />
}
