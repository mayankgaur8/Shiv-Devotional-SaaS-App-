'use client'

import { useEffect, useRef, useState } from 'react'

interface LazyRenderProps {
  children: React.ReactNode
  placeholderClassName?: string
  rootMargin?: string
  minHeight?: number
}

export default function LazyRender({
  children,
  placeholderClassName = 'rounded-2xl border border-white/10 bg-white/3 animate-pulse',
  rootMargin = '200px',
  minHeight = 180,
}: LazyRenderProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current || visible) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [rootMargin, visible])

  return (
    <div ref={ref}>
      {visible ? children : <div className={placeholderClassName} style={{ minHeight }} aria-hidden="true" />}
    </div>
  )
}
