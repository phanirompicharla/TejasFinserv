export function formatINR(value: number, compact = false): string {
  const rounded = Math.round(value)
  if (compact) {
    if (Math.abs(rounded) >= 1_00_00_000) {
      return `₹${(rounded / 1_00_00_000).toFixed(2)} Cr`
    }
    if (Math.abs(rounded) >= 1_00_000) {
      return `₹${(rounded / 1_00_000).toFixed(2)} L`
    }
  }
  return `₹${rounded.toLocaleString('en-IN')}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export const CALC_DISCLAIMER =
  'Illustrative only. Returns assumed, not guaranteed. Mutual Funds are subject to market risks.'
