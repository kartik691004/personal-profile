import { memo, useEffect, useRef, useState } from 'react'
import { clamp01, onFrame, quantizeBlur } from '../scroll'

interface Tile {
  label: string
  baseXOffset: number
  delay: number
}

const TILES: Tile[] = [
  { label: 'AI & Automation', baseXOffset: 120, delay: 0 },
  { label: 'Full-Stack Development', baseXOffset: 180, delay: 100 },
  { label: 'Open to Opportunities', baseXOffset: 240, delay: 200 },
]

const REVEAL_START = 0.75
const REVEAL_SPAN = 0.22
const MOBILE_FACTOR = 0.25
const MAX_REVEAL_BLUR = 12
const NEIGHBOUR_SHIFT = 13.8
const HOVER_SCALE = 1.2

function SoapTiles() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)

  const outerRefs = useRef<(HTMLDivElement | null)[]>([])
  // matchMedia was previously evaluated during render, i.e. ~60x/second. Now it is
  // read once and kept current by change events.
  const isMobileRef = useRef(false)
  const isFinePointerRef = useRef(true)
  const visibleRef = useRef(false)

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const pointerQuery = window.matchMedia('(pointer: fine)')
    isMobileRef.current = mobileQuery.matches
    isFinePointerRef.current = pointerQuery.matches
    const onMobileChange = (e: MediaQueryListEvent) => {
      isMobileRef.current = e.matches
    }
    const onPointerChange = (e: MediaQueryListEvent) => {
      isFinePointerRef.current = e.matches
    }
    mobileQuery.addEventListener('change', onMobileChange)
    pointerQuery.addEventListener('change', onPointerChange)

    const outers = outerRefs.current
    const lastTransform = new Array<string>(outers.length).fill('')
    const lastOpacity = new Array<number>(outers.length).fill(-1)
    const lastBlur = new Array<number>(outers.length).fill(-1)

    const unsubscribe = onFrame((progress) => {
      const isVisible = progress > REVEAL_START
      if (isVisible !== visibleRef.current) {
        visibleRef.current = isVisible
        setVisible(isVisible)
        // Scrolling back up must clear the reveal blur, otherwise a hidden tile
        // keeps a blur filter alive — the exact cost this component had before.
        if (!isVisible) {
          for (let i = 0; i < outers.length; i++) {
            const el = outers[i]
            if (!el) continue
            el.style.filter = ''
            lastBlur[i] = 0
          }
        }
      }
      if (!isVisible) return false

      const ease = clamp01((progress - REVEAL_START) / REVEAL_SPAN)
      const mobile = isMobileRef.current

      for (let i = 0; i < outers.length; i++) {
        const el = outers[i]
        if (!el) continue

        const base = mobile ? TILES[i].baseXOffset * MOBILE_FACTOR : TILES[i].baseXOffset
        const transform = `translate3d(${((ease - 1) * base).toFixed(2)}px, 0, 0)`
        if (transform !== lastTransform[i]) {
          el.style.transform = transform
          lastTransform[i] = transform
        }

        const opacity = Math.round(ease * 100) / 100
        if (opacity !== lastOpacity[i]) {
          el.style.opacity = String(opacity)
          lastOpacity[i] = opacity
        }

        // Drops to none the moment the reveal finishes, so the resting state has
        // no blur filter at all.
        const blur = ease >= 1 ? 0 : quantizeBlur((1 - ease) * MAX_REVEAL_BLUR, 1)
        if (blur !== lastBlur[i]) {
          el.style.filter = blur > 0 ? `blur(${blur}px)` : ''
          lastBlur[i] = blur
        }
      }
    })

    return () => {
      mobileQuery.removeEventListener('change', onMobileChange)
      unsubscribe()
    }
  }, [])

  return (
    <div
      className={`absolute left-4 right-4 md:left-[64px] top-[38%] md:top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 md:gap-[10px] transition-all duration-[800ms] ease-out ${
        visible
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : 'opacity-0 -translate-x-6 md:-translate-x-12 pointer-events-none'
      }`}
    >
      {TILES.map((tile, i) => {
        const isHovered = hovered === i
        const neighbourShift =
          hovered !== null && !isHovered ? (i < hovered ? -NEIGHBOUR_SHIFT : NEIGHBOUR_SHIFT) : 0

        return (
          <div
            key={tile.label}
            ref={(el) => {
              outerRefs.current[i] = el
            }}
            className="w-full md:w-auto md:self-start"
          >
            {/* Hover physics live on their own element with a CSS transition, so they
                never contend with the scroll-driven transform on the parent. */}
            <div
              onMouseEnter={() => isFinePointerRef.current && setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative h-[52px] sm:h-[72px] md:h-[138px] text-black bg-white rounded-xl sm:rounded-2xl md:rounded-[34px] flex items-center justify-center px-4 sm:px-8 md:px-14 w-full md:w-auto cursor-pointer origin-left whitespace-nowrap transition-transform duration-[400ms] ease-out motion-reduce:transition-none"
              style={{
                transform: `translateY(${neighbourShift}px) scale(${isHovered ? HOVER_SCALE : 1})`,
              }}
            >
              <span className="font-michroma text-[11px] sm:text-[14px] md:text-[23px] leading-[16px] sm:leading-[22px] md:leading-[34px] font-medium tracking-tight">
                {tile.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default memo(SoapTiles)
