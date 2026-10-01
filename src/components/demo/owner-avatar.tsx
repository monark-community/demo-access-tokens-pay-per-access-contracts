"use client"

import Image from "next/image"

import type { Owner } from "@/lib/demo/types"
import { PHOTOS } from "@/lib/photos"
import { cn } from "@/lib/utils"

/** Initials for a monogram: "Harbourview Parks & Recreation" → "HP". */
function initials(name: string): string {
  const words = name.split(/[\s&·-]+/).filter((w) => /^\p{L}/u.test(w))
  return (words[0]?.[0] ?? "?").concat(words[1]?.[0] ?? "").toUpperCase()
}

/**
 * Who you pay at a gate. People show their portrait; organisations a mono
 * monogram on the key tint. Decorative: the name is always written next to it.
 */
export function OwnerAvatar({ owner, className }: { owner: Owner; className?: string }) {
  const photo = owner.avatar ? PHOTOS[owner.avatar] : undefined
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-key font-mono text-sm font-bold text-key-foreground ring-1 ring-border",
        owner.kind === "org" && "rounded-md",
        className
      )}
    >
      {photo ? <Image src={photo.src} alt="" fill sizes="48px" className="object-cover" /> : initials(owner.name)}
    </span>
  )
}
