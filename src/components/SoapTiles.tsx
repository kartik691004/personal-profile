import { useState } from 'react'

interface SoapTilesProps {
  scrollProgress: number
}

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

export default function SoapTiles({ scrollProgress }: SoapTilesProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const easeProgress = Math.min(1, Math.max(0, (scrollProgress - 0.75) / 0.22))
  const visible = scrollProgress > 0.75
  const isFinePointer = window.matchMedia('(pointer: fine)').matches

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
        const neighborShift = isFinePointer && hovered !== null && !isHovered ? (i < hovered ? -13.8 : 13.8) : 0
        const mobileFactor = 0.25
        const offset = (easeProgress - 1) * (window.innerWidth < 768 ? tile.baseXOffset * mobileFactor : tile.baseXOffset)
        const transitionDelay = `${tile.delay}ms`

        return (
          <div
            key={tile.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="group relative h-[52px] sm:h-[72px] md:h-[138px] text-black bg-white rounded-xl sm:rounded-2xl md:rounded-[34px] flex items-center justify-center px-4 sm:px-8 md:px-14 w-full md:w-auto md:self-start cursor-pointer origin-left whitespace-nowrap transition-all duration-[400ms] cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transform: `translateX(${offset}px) translateY(${neighborShift}px) scale(${isFinePointer && isHovered ? 1.2 : 1})`,
              opacity: easeProgress,
              filter: `blur(${(1 - easeProgress) * 12}px)`,
              transitionDelay,
            }}
          >
            <span className="font-michroma text-[11px] sm:text-[14px] md:text-[23px] leading-[16px] sm:leading-[22px] md:leading-[34px] font-medium tracking-tight">
              {tile.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}