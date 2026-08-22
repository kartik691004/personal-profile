import { memo, useEffect, useRef } from 'react'
import { DRUM_LINES } from '../data'
import { clamp01, DRUM_END, DRUM_START, onFrame, quantizeBlur, SECOND_SCREEN_START } from '../scroll'

const R = 380
const LINE_HEIGHT = 32
const LAST_INDEX = DRUM_LINES.length - 1

/**
 * The depth blur used to be a raw fractional value (0.375px, 1.125px, ...) written
 * to ~31 lines on every frame, which forced the browser to re-rasterise every line
 * 60x/second. Snapping to 2px steps means a given line changes its blur only a
 * handful of times across the whole scroll, and anything under 1px is dropped
 * entirely because it costs a full raster pass while being invisible.
 */
const BLUR_STEP = 2
const MIN_BLUR = 1

/**
 * 32 lines of copy mapped onto a virtual cylinder. Nothing here is React state:
 * the lines are rendered once and then transformed imperatively, so scrolling the
 * drum costs zero React renders and zero reconciliation.
 */
function CylindricalTextDrum() {
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    const lines = lineRefs.current
    // Cache the last value written per line so we never touch the CSSOM for a
    // property that has not actually changed.
    const lastTransform = new Array<string>(lines.length).fill('')
    const lastOpacity = new Array<number>(lines.length).fill(-1)
    const lastBlur = new Array<number>(lines.length).fill(-1)
    const lastHidden = new Array<boolean | null>(lines.length).fill(null)
    // Paint the resting state once, then skip entirely while off-screen.
    let painted = false

    return onFrame((progress) => {
      // The dark panel hasn't started rising, so none of this is on screen yet.
      if (painted && progress < SECOND_SCREEN_START) return false
      painted = true

      const targetIndex = clamp01((progress - DRUM_START) / (DRUM_END - DRUM_START)) * LAST_INDEX

      for (let i = 0; i < lines.length; i++) {
        const el = lines[i]
        if (!el) continue

        const indexDiff = i - targetIndex
        const translateY = indexDiff * LINE_HEIGHT
        const angleRad = translateY / R
        const cos = Math.cos(angleRad)
        const opacity = cos <= 0.2 ? 0 : (cos - 0.2) / 0.8

        // Fully transparent lines are pulled out of the render path so the browser
        // stops rasterising and compositing them at all.
        const hidden = opacity <= 0
        if (hidden !== lastHidden[i]) {
          el.style.visibility = hidden ? 'hidden' : 'visible'
          lastHidden[i] = hidden
        }
        if (hidden) continue

        const angleDeg = (angleRad * 180) / Math.PI
        const translateZ = cos * R - R
        const baseScale = 0.78 + cos * 0.22

        const transform = `translateY(${translateY.toFixed(2)}px) translateZ(${translateZ.toFixed(2)}px) rotateX(${(-angleDeg * 0.8).toFixed(2)}deg) scale(${baseScale.toFixed(4)})`
        if (transform !== lastTransform[i]) {
          el.style.transform = transform
          lastTransform[i] = transform
        }

        const roundedOpacity = Math.round(opacity * 100) / 100
        if (roundedOpacity !== lastOpacity[i]) {
          el.style.opacity = String(roundedOpacity)
          lastOpacity[i] = roundedOpacity
        }

        const rawBlur = Math.min(8, Math.max(0, (Math.abs(indexDiff) - 1.5) * 0.75))
        const blur = rawBlur < MIN_BLUR ? 0 : quantizeBlur(rawBlur, BLUR_STEP)
        if (blur !== lastBlur[i]) {
          el.style.filter = blur > 0 ? `blur(${blur}px)` : ''
          lastBlur[i] = blur
        }
      }
    })
  }, [])

  return (
    <div
      className="absolute inset-y-0 left-0 w-full sm:w-[65%] md:w-[60%] z-30 flex flex-col items-start justify-center pointer-events-none select-none text-left pl-6 sm:pl-12 md:pl-20 py-16"
      style={{ perspective: '1000px', perspectiveOrigin: '25% 50%' }}
    >
      <div
        className="relative w-full h-[85vh] flex flex-col justify-center items-start overflow-visible"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {DRUM_LINES.map((line, idx) => {
          const isEmpty = line.segments.length === 1 && line.segments[0].text === ''
          return (
            <p
              key={idx}
              ref={(el) => {
                lineRefs.current[idx] = el
              }}
              className="font-manrope text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold leading-[0.90] tracking-[-0.035em] whitespace-nowrap origin-left"
            >
              {isEmpty ? (
                <span className="opacity-30">&nbsp;&nbsp;&nbsp;&nbsp;</span>
              ) : (
                line.segments.map((segment, j) => (
                  <span
                    key={j}
                    className={segment.highlight ? 'text-white font-bold opacity-100' : 'text-white/60'}
                  >
                    {segment.text}
                  </span>
                ))
              )}
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default memo(CylindricalTextDrum)
