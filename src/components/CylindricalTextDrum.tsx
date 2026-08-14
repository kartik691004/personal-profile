import { DRUM_LINES } from '../data'

interface CylindricalTextDrumProps {
  scrollProgress: number
}

const R = 380
const LINE_HEIGHT = 32
const DRUM_START = 1.45
const DRUM_END = 3.5

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

export default function CylindricalTextDrum({ scrollProgress }: CylindricalTextDrumProps) {
  const targetIndex = clamp01((scrollProgress - DRUM_START) / (DRUM_END - DRUM_START)) * (DRUM_LINES.length - 1)

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
          const indexDiff = idx - targetIndex
          const translateY = indexDiff * LINE_HEIGHT
          const angleRad = translateY / R
          const angleDeg = (angleRad * 180) / Math.PI
          const translateZ = Math.cos(angleRad) * R - R
          const baseScale = 0.78 + Math.cos(angleRad) * 0.22
          const opacity = Math.max(0, (Math.cos(angleRad) - 0.2) / 0.8)
          const depthBlur = Math.min(8, Math.max(0, (Math.abs(indexDiff) - 1.5) * 0.75))
          const isEmpty = line.segments.length === 1 && line.segments[0].text === ''

          return (
            <p
              key={idx}
              className="font-manrope text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold leading-[0.90] tracking-tight whitespace-nowrap"
              style={{
                transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${-angleDeg * 0.8}deg) scale(${baseScale})`,
                transformOrigin: 'left center',
                opacity,
                letterSpacing: '-0.035em',
                filter: depthBlur > 0.1 ? `blur(${depthBlur}px)` : undefined,
              }}
            >
              {isEmpty ? (
                <span style={{ opacity: opacity * 0.3 }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
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