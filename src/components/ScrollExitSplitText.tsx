import { memo, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { clamp01, easeInOutCubic, HERO_COVERED_AT, onFrame } from '../scroll'

interface ScrollExitSplitTextProps {
  children: string
  containerClassName?: string
  style?: CSSProperties
}

/*
 * Values transcribed from the GSAP timeline this replaces, so the motion is
 * unchanged: fromTo(chars, ..., { yPercent: 300, y: '25vh', scaleY: 1.2,
 * scaleX: 0.9, opacity: 0, stagger: 0.03, ease: 'power2.inOut' }).
 * GSAP's default tween duration is 0.5s and power2 is a cubic curve.
 */
const CHAR_DURATION = 0.5
const STAGGER = 0.03
const EXIT_Y_PERCENT = 300
const EXIT_Y_VH = 0.25
const EXIT_SCALE_Y = 1.2
const EXIT_SCALE_X = 0.9

function splitToChars(text: string) {
  return text.split('').map((char, i) => (
    <span key={i} className="char inline-block origin-top will-change-transform">
      {char === ' ' ? ' ' : char}
    </span>
  ))
}

function ScrollExitSplitText({ children, containerClassName, style }: ScrollExitSplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chars = Array.from(container.querySelectorAll<HTMLElement>('.char'))
    if (!chars.length) return

    const total = CHAR_DURATION + (chars.length - 1) * STAGGER
    const lastTransform = new Array<string>(chars.length).fill('')
    const lastOpacity = new Array<number>(chars.length).fill(-1)

    let exitY = window.innerHeight * EXIT_Y_VH
    const handleResize = () => {
      exitY = window.innerHeight * EXIT_Y_VH
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const unsubscribe = onFrame((progress) => {
      if (progress >= HERO_COVERED_AT) return false

      const t = clamp01(progress) * total

      for (let i = 0; i < chars.length; i++) {
        const local = clamp01((t - i * STAGGER) / CHAR_DURATION)
        const eased = easeInOutCubic(local)

        const transform = `translateY(${(eased * EXIT_Y_PERCENT).toFixed(2)}%) translateY(${(eased * exitY).toFixed(2)}px) scaleX(${(1 + (EXIT_SCALE_X - 1) * eased).toFixed(4)}) scaleY(${(1 + (EXIT_SCALE_Y - 1) * eased).toFixed(4)})`
        if (transform !== lastTransform[i]) {
          chars[i].style.transform = transform
          lastTransform[i] = transform
        }

        const opacity = Math.round((1 - eased) * 100) / 100
        if (opacity !== lastOpacity[i]) {
          chars[i].style.opacity = String(opacity)
          lastOpacity[i] = opacity
        }
      }
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      unsubscribe()
    }
  }, [children])

  return (
    <div ref={containerRef} className={containerClassName} style={style}>
      {splitToChars(children)}
    </div>
  )
}

export default memo(ScrollExitSplitText)
