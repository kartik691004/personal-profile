import type { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  gap?: string
  speed?: number
}

export default function Marquee({ children, gap = '80px', speed = 25 }: MarqueeProps) {
  return (
    <div className="marquee-container" style={{ gap }}>
      <div className="marquee-track items-center" style={{ gap, animationDuration: `${speed}s` }}>
        {children}
        {children}
      </div>
    </div>
  )
}