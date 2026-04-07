"use client";
import { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./snapshot.module.css";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import FlyingPosters, {
  type FlyingPostersHandle,
} from "@/components/ui/FlyingPosters";

gsap.registerPlugin(ScrollTrigger);

const POSTER_IMAGES = [
  "/images/gallery-1.webp",
  "/images/gallery-2.webp",
  "/images/gallery-3.webp",
  "/images/gallery-4.webp",
  "/images/gallery-5.webp",
  "/images/gallery-6.webp",
  "/images/gallery-7.webp",
];

// Fallback scroll distance in OGL world units if getScrollTotal() isn't ready
const SCROLL_FALLBACK = 180;

export default function Snapshot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const postersRef = useRef<FlyingPostersHandle>(null);
  // Mutable ref so we can update the endpoint after OGL initialises
  const scrollTotalRef = useRef(SCROLL_FALLBACK);

  // ── 1. Create the GSAP timeline + ScrollTrigger synchronously in layout ──
  // This guarantees the pin is registered BEFORE Enamorate's useLayoutEffect
  // runs, so GSAP correctly stacks the two pins.
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const proxy = { value: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Step 1 — Text reveal
    tl.fromTo(
      `.${styles.snapshotContent}`,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
    );

    // Step 2 — Drive FlyingPosters scroll via ref (zero React re-renders)
    // Uses scrollTotalRef.current so we always read the latest value,
    // even if OGL hadn't finished setting up when the timeline was created.
    tl.to(proxy, {
      value: 1, // normalised 0→1
      duration: 4,
      ease: "none",
      onUpdate() {
        postersRef.current?.setScroll(proxy.value * scrollTotalRef.current);
      },
    });

    // Step 3 — Pause at end before unpinning
    tl.to({}, { duration: 0.3 });

    const st = tl.scrollTrigger;

    return () => {
      st?.kill();
      tl.kill();
    };
  }, []);

  // ── 2. After OGL initialises, read the real scroll total ──
  useEffect(() => {
    // OGL Canvas is created in FlyingPosters' useEffect, which fires after
    // this component's useLayoutEffect. We wait one frame for geometry setup.
    const id = requestAnimationFrame(() => {
      const total = postersRef.current?.getScrollTotal();
      if (total && total > 0) {
        scrollTotalRef.current = total;
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section ref={containerRef} className={styles.snapshot}>
      <div className={styles.postersWrapper}>
        <FlyingPosters
          ref={postersRef}
          items={POSTER_IMAGES}
          disableInternalScrolling={true}
          planeWidth={320}
          planeHeight={390}
          distortion={2}
          scrollEase={0.8}
        />
      </div>

      <div className={styles.snapshotContent}>
        <h2 className={styles.title}>
          El arte de <span className={styles.italic}>recibirte</span>.
        </h2>
        <TextBlockAnimation
          blockColor="var(--white)"
          className={styles.description}
        >
          Elevamos su estancia en Japón a una categoría superior de
          exclusividad. Nuestros itinerarios premium son piezas únicas de
          ingeniería emocional, diseñadas para anticipar cada una de sus
          necesidades antes de que estas surjan. El acceso más puro al
          archipiélago, destilado para los paladares más exigentes.
        </TextBlockAnimation>
      </div>
    </section>
  );
}
