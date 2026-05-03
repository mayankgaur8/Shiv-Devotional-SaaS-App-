'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const navLinks = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/companion', label: 'AI Sahayak', icon: '🤖' },
  { href: '/rudraksha', label: 'Rudraksha', icon: '📿' },
  { href: '/shravan', label: 'Shravan', icon: '🌧️' },
  { href: '/bhajan', label: 'Bhajan / Songs', icon: '🎵' },
  { href: '/temple', label: 'Temple', icon: '🛕' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={handleNavClick}>
          <span className="text-2xl animate-om-spin">🕉️</span>
          <div>
            <span className="text-lg font-bold gold-shimmer">ShivMandir</span>
            <p className="text-[10px] text-bhasma-400 leading-none">Har Har Mahadev</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === link.href
                  ? 'bg-saffron-500/20 text-saffron-400 border border-saffron-500/30'
                  : 'text-bhasma-400 hover:text-saffron-400 hover:bg-saffron-500/10'
              )}
            >
              <span className="mr-1.5">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-bhasma-500">Free Plan</span>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-saffron-500 to-saffron-600 text-white hover:from-saffron-400 hover:to-saffron-500 transition-all saffron-glow">
            Upgrade ₹99/mo
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileOpen(prev => !prev)}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm text-bhasma-300 hover:bg-white/10"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            Menu
          </button>
        </div>
      </div>

      <div
        className={clsx(
          'md:hidden overflow-hidden transition-[max-height] duration-300 border-t border-white/10',
          mobileOpen ? 'max-h-[75vh]' : 'max-h-0 border-t-0'
        )}
      >
        <div className="px-4 py-3 space-y-2 bg-[#080C14]/95">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className={clsx(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                pathname === link.href
                  ? 'bg-saffron-500/20 text-saffron-300 border border-saffron-500/40'
                  : 'text-bhasma-300 hover:bg-white/10'
              )}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
