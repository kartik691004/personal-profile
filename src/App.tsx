import { useEffect, useRef, useState } from 'react'
import VideoScrubber from './components/VideoScrubber'
import SecondVideoScrubber from './components/SecondVideoScrubber'
import ScrollExitSplitText from './components/ScrollExitSplitText'
import SoapTiles from './components/SoapTiles'
import CylindricalTextDrum from './components/CylindricalTextDrum'
import Header from './components/Header'
import Marquee from './components/Marquee'
import {
  addRaw,
  animateTo,
  onFrame,
  quantizeBlur,
  secondScreenProgress,
  setPointerTarget,
} from './scroll'
import {
  AutomateWordmark,
  ChristUniversityWordmark,
  FtbHustleWordmark,
  FullstackWordmark,
  GithubWordmark,
  LinkedinWordmark,
  ZidioWordmark,
} from './components/Logos'

/** Wheel/touch sensitivity. Higher = fewer gestures to cross the whole page. */
const WHEEL_SCALE = 0.0014
const TOUCH_SCALE = 0.003
const NAV_DURATION = 850

const MAX_HERO_BLUR = 64
/** Re-rasterising a full-screen blurred video is costly — move it in 4px steps. */
const HERO_BLUR_STEP = 4

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
  const [activeSectionId, setActiveSectionId] = useState('hero')

  const heroLayerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const lastTouchYRef = useRef(0)
  const activeSectionRef = useRef('hero')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      addRaw(e.deltaY * WHEEL_SCALE)
    }

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchYRef.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY
      addRaw((lastTouchYRef.current - currentY) * TOUCH_SCALE)
      lastTouchYRef.current = currentY
    }

    // Native scrolling is disabled, so keyboard paging has to be wired up by hand.
    const handleKeyDown = (e: KeyboardEvent) => {
      const step =
        e.key === 'PageDown' || e.key === ' ' ? 0.45 : e.key === 'PageUp' ? -0.45 : 0
      const nudge = e.key === 'ArrowDown' ? 0.12 : e.key === 'ArrowUp' ? -0.12 : 0
      if (e.key === 'Home') return animateTo(0, NAV_DURATION)
      if (e.key === 'End') return animateTo(3.5, NAV_DURATION)
      if (step || nudge) {
        e.preventDefault()
        addRaw(step || nudge)
      }
    }

    // One pointer listener for the whole app; both parallax layers read from it.
    const handleMouseMove = (e: MouseEvent) => {
      setPointerTarget(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const handleNavigateToSection = (targetRatio: number) => animateTo(targetRatio, NAV_DURATION)
    window.__kartikNavigate = handleNavigateToSection

    let lastBlur = -1
    let lastHeroHidden: boolean | null = null
    let lastPanelHidden: boolean | null = null

    const unsubscribe = onFrame((progress, raw) => {
      const p = secondScreenProgress(progress)
      const hero = heroLayerRef.current
      const panel = panelRef.current

      if (hero) {
        // Once the panel fully covers the hero, take it out of the render path
        // entirely — that stops a blurred full-screen video from being rasterised.
        const hidden = p >= 1
        if (hidden !== lastHeroHidden) {
          hero.style.visibility = hidden ? 'hidden' : 'visible'
          lastHeroHidden = hidden
        }
        if (!hidden) {
          const blur = quantizeBlur(Math.sin((p * Math.PI) / 2) * MAX_HERO_BLUR, HERO_BLUR_STEP)
          if (blur !== lastBlur) {
            hero.style.filter = blur > 0 ? `blur(${blur}px)` : ''
            lastBlur = blur
          }
        }
      }

      if (panel) {
        const hidden = p <= 0
        if (hidden !== lastPanelHidden) {
          panel.style.visibility = hidden ? 'hidden' : 'visible'
          lastPanelHidden = hidden
        }
        if (!hidden) {
          const eased = 1 - Math.pow(1 - p, 3)
          panel.style.transform = `translate3d(0, ${(1 - eased) * 100}%, 0)`
        }
      }

      const next = updateActiveSection(raw)
      if (next !== activeSectionRef.current) {
        activeSectionRef.current = next
        setActiveSectionId(next)
      }
    })

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      unsubscribe()
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
      delete window.__kartikNavigate
    }
  }, [])

  const handleNavigate = (scrollRatio: number) => {
    window.__kartikNavigate?.(scrollRatio)
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#FF005E] text-white">
      <div className="relative w-full h-full overflow-hidden">
        <div ref={heroLayerRef} className="absolute inset-0 w-full h-full z-10">
          <VideoScrubber />

          <div className="absolute bottom-[40px] left-[1%] right-[1%] w-[98%] z-20 pointer-events-none select-none flex justify-center items-center">
            <ScrollExitSplitText
              containerClassName="w-full text-[10.4vw] leading-none font-michroma font-normal uppercase text-white whitespace-nowrap text-center"
              style={{ letterSpacing: '-0.07em' }}
            >
              KARTIK
            </ScrollExitSplitText>
          </div>

          <SoapTiles />
        </div>

        <Header activeSectionId={activeSectionId} onNavigate={handleNavigate} />

        <div
          ref={panelRef}
          className="absolute bottom-0 left-0 w-full h-full bg-[#11010a] rounded-t-[48px] overflow-hidden z-40"
          style={{ transform: 'translate3d(0, 100%, 0)', visibility: 'hidden', willChange: 'transform' }}
        >
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-[5px] bg-white rounded-full z-50 pointer-events-none" />
          <SecondVideoScrubber />
          <CylindricalTextDrum />

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
