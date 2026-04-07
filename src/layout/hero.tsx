"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./hero.module.css"
import App from "../components/geisha-samurai"

export default function Hero() {
    const wrapperRef = useRef<HTMLElement>(null)
    const [pinned, setPinned] = useState(true)

    useEffect(() => {
        const wrapper = wrapperRef.current
        if (!wrapper) return

        const observer = new IntersectionObserver(
            ([entry]) => setPinned(entry.isIntersecting),
            { threshold: 0 }
        )
        observer.observe(wrapper)
        return () => observer.disconnect()
    }, [])

    return (
        <section ref={wrapperRef} className={styles.heroWrapper}>
            <div className={pinned ? styles.hero : styles.heroUnpinned}>
                <div className={styles.geishaSamurai}>
                    <App />
                </div>
            </div>
        </section>
    )
}
