/**
 * Central scroll/animation engine.
 *
 * The whole site is driven by a single number (0 -> MAX_PROGRESS). Previously that
 * number lived in React state and was written every frame, which re-rendered the
 * entire component tree ~60x/second. Here it lives outside React: components
 * subscribe with `onFrame` and write to their own DOM nodes imperatively, so a
 * scroll costs zero React renders.
 *
 * One rAF loop drives scroll smoothing, nav tweens and pointer parallax together,
 * and it stops itself as soon as everything has settled (idle = 0 CPU).
 */

export const MAX_PROGRESS = 3.5

/* ---- stage timings (shared so layers agree on when they are off-screen) ---- */

/** Progress at which the dark second screen starts rising. */
export const SECOND_SCREEN_START = 1.15
/** Progress span over which it fully covers the hero. */
export const SECOND_SCREEN_SPAN = 0.5
/** Hero is completely hidden past this point, so it can stop doing any work. */
export const HERO_COVERED_AT = SECOND_SCREEN_START + SECOND_SCREEN_SPAN

export const DRUM_START = 1.45
export const DRUM_END = MAX_PROGRESS

/** Below this delta the scroll is considered settled and snaps to its target. */
const SETTLE_EPS = 0.00025
const POINTER_EPS = 0.0005

export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Scroll lerp factor. Higher = snappier response to the wheel. */
const SCROLL_SMOOTHING = prefersReducedMotion ? 1 : 0.16
/** Parallax lerp factor — mimics the old 1.2s power2.out follow. */
const POINTER_SMOOTHING = prefersReducedMotion ? 1 : 0.07

/** Return `true` from a frame callback to keep the loop alive another frame. */
type FrameFn = (progress: number, raw: number) => boolean | void

const subscribers = new Set<FrameFn>()

let raw = 0
let smoothed = 0
let rafId: number | null = null

let tween: { from: number; to: number; start: number; dur: number } | null = null

let pointerTargetX = 0
let pointerTargetY = 0
let pointerX = 0
let pointerY = 0

export function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value
}

export function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value
}

export function easeInOutCubic(p: number) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
}

/** 0 -> 1 as the dark panel rises over the hero. */
export function secondScreenProgress(progress: number) {
  return clamp01((progress - SECOND_SCREEN_START) / SECOND_SCREEN_SPAN)
}

/**
 * Blur is the single most expensive thing on this page: a fractional value that
 * changes every frame forces the browser to re-rasterise the layer every frame.
 * Snapping to a step means the value only changes a handful of times across a
 * transition, so the rasterised result can be reused. Visually indistinguishable
 * while moving.
 */
export function quantizeBlur(px: number, step: number) {
  return Math.round(px / step) * step
}

export function getSmoothed() {
  return smoothed
}

export function getPointerX() {
  return pointerX
}

export function getPointerY() {
  return pointerY
}

function wake() {
  if (rafId === null) rafId = requestAnimationFrame(tick)
}

function setRawInternal(next: number) {
  raw = clamp(next, 0, MAX_PROGRESS)
  wake()
}

/** Direct user input — cancels any in-flight nav tween. */
export function setRaw(next: number) {
  tween = null
  setRawInternal(next)
}

export function addRaw(delta: number) {
  setRaw(raw + delta)
}

/** Eased navigation to a target progress (header nav / logo click). */
export function animateTo(target: number, duration: number) {
  if (duration <= 0 || prefersReducedMotion) {
    setRaw(target)
    return
  }
  tween = {
    from: raw,
    to: clamp(target, 0, MAX_PROGRESS),
    start: performance.now(),
    dur: duration,
  }
  wake()
}

export function setPointerTarget(x: number, y: number) {
  pointerTargetX = x
  pointerTargetY = y
  wake()
}

export function onFrame(fn: FrameFn) {
  subscribers.add(fn)
  fn(smoothed, raw) // paint initial state immediately
  wake()
  return () => {
    subscribers.delete(fn)
  }
}

function tick() {
  rafId = null
  let busy = false

  if (tween) {
    const t = clamp((performance.now() - tween.start) / tween.dur, 0, 1)
    raw = tween.from + (tween.to - tween.from) * easeInOutCubic(t)
    if (t >= 1) tween = null
    else busy = true
  }

  const diff = raw - smoothed
  if (Math.abs(diff) > SETTLE_EPS) {
    smoothed += diff * SCROLL_SMOOTHING
    busy = true
  } else {
    smoothed = raw
  }

  const pdx = pointerTargetX - pointerX
  const pdy = pointerTargetY - pointerY
  if (Math.abs(pdx) > POINTER_EPS || Math.abs(pdy) > POINTER_EPS) {
    pointerX += pdx * POINTER_SMOOTHING
    pointerY += pdy * POINTER_SMOOTHING
    busy = true
  } else {
    pointerX = pointerTargetX
    pointerY = pointerTargetY
  }

  for (const fn of subscribers) {
    if (fn(smoothed, raw) === true) busy = true
  }

  if (busy) rafId = requestAnimationFrame(tick)
}
