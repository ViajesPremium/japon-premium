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

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

export default SmoothScroll
