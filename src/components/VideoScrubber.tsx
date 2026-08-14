import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface VideoScrubberProps {
  scrollProgress: number
}

const VIDEO_URL =
  'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/202606021731-e_hqa6sn.mp4'
const FALLBACK_DURATION = 4.2

export default function VideoScrubber({ scrollProgress }: VideoScrubberProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const currentRef = useRef(0)

  useEffect(() => {
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap) return

    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX / window.innerWidth - 0.5
      const my = e.clientY / window.innerHeight - 0.5
      gsap.to(wrap, { x: -mx * 40, y: -my * 40, duration: 1.2, ease: 'power2.out', overwrite: 'auto' })
    }
    window.addEventListener('mousemove', handleMouseMove)

    const duration = video.duration || FALLBACK_DURATION

    const tick = () => {
      const targetTime = Math.min(1, Math.max(0, scrollProgress)) * duration
      currentRef.current += (targetTime - currentRef.current) * 0.15
      if (!video.seeking && Math.abs(video.currentTime - currentRef.current) > 0.01) {
        video.currentTime = currentRef.current
      }
    }

    let raf: number
    const loop = () => {
      tick()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [scrollProgress])

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#FF005E] will-change-transform"
      style={{ scale: '1.05' }}
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        playsInline
        muted
        preload="auto"
        onLoadedMetadata={() => setIsLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-[#FF005Ef4]">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping" />
            <span className="h-10 w-10 rounded-full border-4 border-[#ea1f63]/20 border-t-[#ea1f63] animate-spin" />
          </div>
          <span className="font-manrope text-[12px] font-semibold tracking-[0.25em] text-pink-500 uppercase drop-shadow-[0_0_8px_rgba(234,31,99,0.4)]">
            Loading scroll stream...
          </span>
        </div>
      )}
    </div>
  )
}