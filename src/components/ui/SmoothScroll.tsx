"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import Lenis from "lenis"

type SmoothScrollProps = {
  children: React.ReactNode
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
      wheelMultiplier: 0.9,
      orientation: "vertical",
      gestureOrientation: "vertical",
      autoResize: true,
      infinite: false,
    })

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(update)

    // Snap suave entre hero y trust-strip
    let isSnapping = false

    const handleWheel = (e: WheelEvent) => {
      if (isSnapping) return

      const heroHeight = window.innerHeight
      const scrollY = window.scrollY

      if (scrollY > 0 && scrollY < heroHeight) {
        isSnapping = true
        const target = e.deltaY > 0 ? heroHeight : 0
        lenis.scrollTo(target, {
          duration: 1.6,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
          lock: true,
          onComplete: () => {
            isSnapping = false
          },
        })
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

export default SmoothScroll
