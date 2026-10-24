export const MIN_ZOOM = 0.5
export const MAX_ZOOM = 3
export const ZOOM_STEP = 0.25

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
