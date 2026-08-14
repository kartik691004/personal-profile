import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'

interface ScrollExitSplitTextProps {
  children: string
  scrollProgress: number
  containerClassName?: string
  style?: CSSProperties
}

function splitToChars(text: string) {
  return text.split('').map((char, i) => (
    <span key={i} className="char inline-block will-change-transform">
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
}

export default function ScrollExitSplitText({
  children,
  scrollProgress,
  containerClassName,
  style,
}: ScrollExitSplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chars = container.querySelectorAll('.char')

    const tl = gsap.timeline({ paused: true })
    tl.fromTo(
      chars,
      { opacity: 1, yPercent: 0, y: 0, scaleY: 1, scaleX: 1, transformOrigin: '50% 0%' },
      {
        opacity: 0,
        yPercent: 300,
        y: '25vh',
        scaleY: 1.2,
        scaleX: 0.9,
        stagger: 0.03,
        ease: 'power2.inOut',
      },
    )
    timelineRef.current = tl

    return () => {
      tl.kill()
      timelineRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!timelineRef.current) return
    gsap.to(timelineRef.current, {
      progress: scrollProgress,
      duration: 0.6,
      ease: 'power1.out',
      overwrite: 'auto',
    })
  }, [scrollProgress])

  return (
    <div ref={containerRef} className={containerClassName} style={style}>
      {splitToChars(children)}
    </div>
  )
}