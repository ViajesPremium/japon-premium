'use client'

import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface MagneticCursorProps {
  children: ReactNode
  magneticFactor?: number
  lerpAmount?: number
  hoverPadding?: number
  hoverAttribute?: string
  cursorSize?: number
  cursorColor?: string
  blendMode?: 'difference' | 'exclusion' | 'normal' | 'screen' | 'overlay'
  cursorClassName?: string
  shape?: 'circle' | 'square' | 'rounded-square'
  disableOnTouch?: boolean
  speedMultiplier?: number
  maxScaleX?: number
  maxScaleY?: number
  contrastBoost?: number
  disableOnMobile?: boolean
  mobileBreakpoint?: number
}

interface CursorPosition {
  current: { x: number; y: number }
  target: { x: number; y: number }
  previous: { x: number; y: number }
}

const MagneticCursor: FC<MagneticCursorProps> = ({
  children,
  lerpAmount = 0.1,
  cursorSize = 24,
  cursorColor = 'white',
  blendMode = 'exclusion',
  cursorClassName = '',
  shape = 'circle',
  disableOnTouch = true,
  speedMultiplier = 0.02,
  maxScaleX = 1,
  maxScaleY = 0.3,
  contrastBoost = 1.5,
  disableOnMobile = true,
  mobileBreakpoint = 768,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef<CursorPosition>({
    current: { x: -100, y: -100 },
    target: { x: -100, y: -100 },
    previous: { x: -100, y: -100 },
  })
  const hasInitializedRef = useRef(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const shouldDisableCursor =
    !hasMounted ||
    (disableOnTouch && (isTouchDevice || isCoarsePointer)) ||
    (disableOnMobile && isMobileViewport)

  useEffect(() => {
    if (!hasMounted) return

    const mobileQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`)
    const coarseQuery = window.matchMedia('(hover: none), (pointer: coarse)')

    const syncFlags = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
      setIsMobileViewport(mobileQuery.matches)
      setIsCoarsePointer(coarseQuery.matches)
    }

    syncFlags()
    mobileQuery.addEventListener('change', syncFlags)
    coarseQuery.addEventListener('change', syncFlags)

    return () => {
      mobileQuery.removeEventListener('change', syncFlags)
      coarseQuery.removeEventListener('change', syncFlags)
    }
  }, [hasMounted, mobileBreakpoint])

  useEffect(() => {
    if (shouldDisableCursor) return

    const styleId = 'magnetic-cursor-hide-native'
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
    const shouldCreate = !styleEl

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      styleEl.textContent = 'html, body, body * { cursor: none !important; }'
      document.head.appendChild(styleEl)
    }

    return () => {
      if (shouldCreate && styleEl?.parentNode) {
        styleEl.parentNode.removeChild(styleEl)
      }
    }
  }, [shouldDisableCursor])

  useEffect(() => {
    if (shouldDisableCursor) return
    const cursorEl = cursorRef.current
    if (!cursorEl) return

    gsap.set(cursorEl, { xPercent: -50, yPercent: -50, opacity: 0 })

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const update = () => {
      const position = positionRef.current
      const effectiveLerp = prefersReducedMotion ? 1 : lerpAmount

      position.current.x += (position.target.x - position.current.x) * effectiveLerp
      position.current.y += (position.target.y - position.current.y) * effectiveLerp

      const deltaX = position.current.x - position.previous.x
      const deltaY = position.current.y - position.previous.y
      position.previous.x = position.current.x
      position.previous.y = position.current.y

      const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * speedMultiplier
      const stretchX = 1 + Math.min(speed, maxScaleX)
      const stretchY = 1 - Math.min(speed, maxScaleY)

      gsap.set(cursorEl, {
        x: position.current.x,
        y: position.current.y,
        rotate: Math.atan2(deltaY, deltaX) * (180 / Math.PI),
        scaleX: stretchX,
        scaleY: stretchY,
        overwrite: 'auto',
      })
    }

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX
      const y = event.clientY

      if (!hasInitializedRef.current) {
        positionRef.current.current.x = x
        positionRef.current.current.y = y
        positionRef.current.target.x = x
        positionRef.current.target.y = y
        positionRef.current.previous.x = x
        positionRef.current.previous.y = y
        hasInitializedRef.current = true
        gsap.set(cursorEl, { x, y, opacity: 1 })
        return
      }

      positionRef.current.target.x = x
      positionRef.current.target.y = y
      gsap.to(cursorEl, { opacity: 1, duration: 0.15, overwrite: 'auto' })
    }

    const onMouseLeave = () => {
      gsap.to(cursorEl, { opacity: 0, duration: 0.2, overwrite: 'auto' })
    }

    const onMouseEnter = () => {
      if (!hasInitializedRef.current) return
      gsap.to(cursorEl, { opacity: 1, duration: 0.2, overwrite: 'auto' })
    }

    gsap.ticker.add(update)
    window.addEventListener('pointermove', onPointerMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      gsap.ticker.remove(update)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [lerpAmount, maxScaleX, maxScaleY, shouldDisableCursor, speedMultiplier])

  if (shouldDisableCursor) return <>{children}</>

  const styles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    pointerEvents: 'none',
    willChange: 'transform',
    backgroundColor: cursorColor,
    mixBlendMode: blendMode,
    width: cursorSize,
    height: cursorSize,
    borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '0' : '8px',
    backdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : 'none',
    WebkitBackdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : 'none',
  }

  return (
    <>
      <div ref={cursorRef} className={`magnetic-cursor ${cursorClassName}`} style={styles} />
      {children}
    </>
  )
}

export default MagneticCursor
