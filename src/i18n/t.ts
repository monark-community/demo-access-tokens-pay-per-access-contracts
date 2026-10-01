/** Replace {placeholders} in a dictionary string. Client-safe (no dictionaries imported). */
export function t(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match))
}

/** Pick the singular or plural form: plural(n, "1 hour", "{n} hours"). */
export function plural(n: number, one: string, other: string): string {
  return t(Math.abs(n) === 1 ? one : other, { n })
}
