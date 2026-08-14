import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAVIGATION_ITEMS } from '../data'
import Logo from './Logo'

interface HeaderProps {
  activeSectionId: string
  onNavigate: (scrollRatio: number) => void
}

export default function Header({ activeSectionId, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = (scrollRatio: number) => {
    setMenuOpen(false)
    onNavigate(scrollRatio)
  }

  return (
    <header className="absolute top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 md:top-[64px] md:left-[64px] md:right-[64px] z-40 flex items-center justify-between">
      <button
        onClick={() => navigate(0)}
        className="flex items-center gap-3 cursor-pointer"
        aria-label="Back to top"
      >
        <Logo className="h-12 w-12" />
        <span className="hidden sm:flex flex-col text-left font-manrope text-[12px] leading-[16px] tracking-wide text-white">
          <span>BCA Student · AI Automation.</span>
          <span>Full-Stack Development.</span>
          <span>Let&apos;s build.</span>
        </span>
      </button>

      <nav className="hidden md:flex items-center gap-1">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.scrollRatio)}
            className={`font-manrope text-[12px] font-medium leading-[16px] tracking-wider rounded-full px-4 py-2 transition-all duration-300 cursor-pointer ${
              activeSectionId === item.id
                ? 'bg-white text-black'
                : 'text-white hover:bg-white hover:text-black'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 cursor-pointer"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
      </button>

      {menuOpen && (
        <div className="fixed inset-0 bg-[#11010a]/98 backdrop-blur-xl z-30 md:hidden">
          <div className="pt-24">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.scrollRatio)}
                className={`block w-full text-left font-michroma text-[16px] uppercase tracking-widest py-4 px-6 border-b border-white/5 cursor-pointer ${
                  activeSectionId === item.id ? 'text-[#FF005E] font-semibold' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}