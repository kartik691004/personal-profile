import { memo, useEffect, useRef, useState } from 'react'
import { clamp01, getPointerX, getPointerY, HERO_COVERED_AT, onFrame } from '../scroll'

const VIDEO_URL =
  'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/202606021731-e_hqa6sn.mp4'
const FALLBACK_DURATION = 4.2
const SEEK_LERP = 0.22
/** Don't ask the decoder to seek for sub-frame deltas — it's the expensive part. */
const SEEK_EPSILON = 0.02
const PARALLAX = 40

function VideoScrubber() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap) return

    let current = 0
    let lastTransform = ''

    // Subscribed once, for the lifetime of the component. The previous version
    // listed scrollProgress as a dependency, so this whole effect — including the
    // rAF loop and a window listener — was torn down and rebuilt on every frame.
    return onFrame((progress) => {
      // Fully covered by the dark panel: no point seeking or moving anything.
      if (progress >= HERO_COVERED_AT) return false

      const transform = `translate3d(${(-getPointerX() * PARALLAX).toFixed(2)}px, ${(-getPointerY() * PARALLAX).toFixed(2)}px, 0)`
      if (transform !== lastTransform) {
        wrap.style.transform = transform
        lastTransform = transform
      }

      const duration = video.duration || FALLBACK_DURATION
      const targetTime = clamp01(progress) * duration
      const delta = targetTime - current
      current += delta * SEEK_LERP

      if (!video.seeking && Math.abs(video.currentTime - current) > SEEK_EPSILON) {
        video.currentTime = current
      }
      // Keep the loop alive while the video is still catching up to the scroll.
      return Math.abs(delta) > SEEK_EPSILON
    })
  }, [])

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

export default memo(VideoScrubber)
