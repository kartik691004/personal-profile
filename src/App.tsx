import { useEffect, useRef, useState } from 'react'
import VideoScrubber from './components/VideoScrubber'
import SecondVideoScrubber from './components/SecondVideoScrubber'
import ScrollExitSplitText from './components/ScrollExitSplitText'
import SoapTiles from './components/SoapTiles'
import CylindricalTextDrum from './components/CylindricalTextDrum'
import Header from './components/Header'
import Marquee from './components/Marquee'
import {
  AutomateWordmark,
  ChristUniversityWordmark,
  FtbHustleWordmark,
  FullstackWordmark,
  GithubWordmark,
  LinkedinWordmark,
  ZidioWordmark,
} from './components/Logos'

const MAX_PROGRESS = 3.5
const WHEEL_SCALE = 0.0006
const TOUCH_SCALE = 0.0015
const NAV_DURATION = 1200

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function easeInOutCubic(p: number) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
}

declare global {
  interface Window {
    __kartikNavigate?: (scrollRatio: number) => void
  }
}

function updateActiveSection(progress: number): string {
  if (progress < 0.18) return 'hero'
  if (progress < 0.45) return 'projects'
  if (progress < 0.68) return 'expertise'
  if (progress < 1.15) return 'about'
  return 'contact'
}

function App() {
  const [lerpedScrollProgress, setLerpedScrollProgress] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState('hero')

  const progressRef = useRef(0)
  const lerpedRef = useRef(0)
  const navRafRef = useRef<number | null>(null)
  const lastTouchYRef = useRef(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const cancelNav = () => {
      if (navRafRef.current !== null) {
        cancelAnimationFrame(navRafRef.current)
        navRafRef.current = null
      }
    }

    const setProgress = (next: number) => {
      progressRef.current = clamp(next, 0, MAX_PROGRESS)
      setActiveSectionId(updateActiveSection(progressRef.current))
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      cancelNav()
      setProgress(progressRef.current + e.deltaY * WHEEL_SCALE)
    }

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchYRef.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY
      const deltaTouchY = lastTouchYRef.current - currentY
      lastTouchYRef.current = currentY
      cancelNav()
      setProgress(progressRef.current + deltaTouchY * TOUCH_SCALE)
    }

    const handleNavigateToSection = (targetRatio: number) => {
      cancelNav()
      const start = progressRef.current
      const delta = targetRatio - start
      const startTime = performance.now()

      const step = (now: number) => {
        const elapsed = now - startTime
        const p = clamp(elapsed / NAV_DURATION, 0, 1)
        const eased = easeInOutCubic(p)
        setProgress(start + delta * eased)
        if (p < 1) {
          navRafRef.current = requestAnimationFrame(step)
        } else {
          navRafRef.current = null
        }
      }
      navRafRef.current = requestAnimationFrame(step)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    let raf: number
    const loop = () => {
      const currentLerp = lerpedRef.current
      const target = progressRef.current
      const next = currentLerp + (target - currentLerp) * 0.08
      if (Math.abs(target - next) > 0.0001) {
        lerpedRef.current = next
        setLerpedScrollProgress(next)
      } else {
        lerpedRef.current = target
        setLerpedScrollProgress(target)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.__kartikNavigate = handleNavigateToSection

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      cancelAnimationFrame(raf)
      if (navRafRef.current !== null) cancelAnimationFrame(navRafRef.current)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      delete window.__kartikNavigate
    }
  }, [])

  const secondScreenProgress = clamp01((lerpedScrollProgress - 1.15) / 0.5)
  const easedRisingProgress = 1 - Math.pow(1 - secondScreenProgress, 3)
  const smoothBlurAmount = Math.sin((secondScreenProgress * Math.PI) / 2) * 64

  const handleNavigate = (scrollRatio: number) => {
    window.__kartikNavigate?.(scrollRatio)
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#FF005E] text-white">
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full z-10 transition-transform duration-[100ms] ease-out"
          style={{ filter: secondScreenProgress > 0 ? `blur(${smoothBlurAmount}px)` : 'none' }}
        >
          <VideoScrubber scrollProgress={Math.min(1, lerpedScrollProgress)} />

          <div className="absolute bottom-[40px] left-[1%] right-[1%] w-[98%] z-20 pointer-events-none select-none flex justify-center items-center">
            <ScrollExitSplitText
              scrollProgress={Math.min(1, lerpedScrollProgress)}
              containerClassName="w-full text-[10.4vw] leading-none font-michroma font-normal uppercase text-white whitespace-nowrap text-center transition-all duration-300 will-change-transform"
              style={{ letterSpacing: '-0.07em' }}
            >
              KARTIK
            </ScrollExitSplitText>
          </div>

          <SoapTiles scrollProgress={lerpedScrollProgress} />
        </div>

        <Header activeSectionId={activeSectionId} onNavigate={handleNavigate} />

        <div
          className="absolute bottom-0 left-0 w-full h-full bg-[#11010a] rounded-t-[48px] overflow-hidden z-40"
          style={{
            transform: `translateY(${(1 - easedRisingProgress) * 100}%)`,
            visibility: secondScreenProgress > 0 ? 'visible' : 'hidden',
            willChange: 'transform',
          }}
        >
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-[5px] bg-white rounded-full z-50 pointer-events-none" />
          <SecondVideoScrubber scrollProgress={lerpedScrollProgress} />
          <CylindricalTextDrum scrollProgress={lerpedScrollProgress} />

          <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 w-full sm:w-[65%] md:w-[60%] pl-6 sm:pl-12 md:pl-20 pr-6 sm:pr-12 md:pr-16 z-50 pointer-events-auto">
            <div className="w-full border-t border-white/[0.08] pt-6">
              <Marquee gap="80px" speed={25}>
                <FtbHustleWordmark size={110} />
                <ZidioWordmark size={110} />
                <ChristUniversityWordmark size={110} />
                <GithubWordmark size={110} />
                <LinkedinWordmark size={110} />
                <AutomateWordmark size={110} />
                <FullstackWordmark size={110} />
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App