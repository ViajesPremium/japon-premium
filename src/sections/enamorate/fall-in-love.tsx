"use client";
import { useLayoutEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";
import styles from "./fall-in-love.module.css";
import TextType from "@/components/ui/TextType";

gsap.registerPlugin(ScrollTrigger);

export default function Enamorate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const sampleImages = useMemo(
    () => [
      {
        src: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Mountain landscape",
      },
      {
        src: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Ocean waves",
      },
      {
        src: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Forest path",
      },
      {
        src: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Desert dunes",
      },
      {
        src: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "City skyline",
      },
      {
        src: "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Northern lights",
      },
      {
        src: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Waterfall",
      },
      {
        src: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Sunset beach",
      },
    ],
    [],
  );

  const typingText = useMemo(() => ["Gastronomía", "Cultura", "Historia"], []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.sectionWrapper}>
      <div className={styles.stickyContainer}>
        <InfiniteGallery
          images={sampleImages}
          speed={1.2}
          zSpacing={3}
          visibleCount={12}
          falloff={{ near: 0.8, far: 14 }}
          isScrollControlled={true}
          scrollProgress={progress}
        />
        <div className={styles.overlay}>
          <h1 className={styles.title}>
            <span className={styles.italic}>Enamorate de la </span>
            <TextType
              as="span"
              className={styles.typing}
              text={typingText}
              typingSpeed={40}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              deletingSpeed={50}
              cursorBlinkDuration={0.4}
            />
            <span className={styles.italic}>de Japón</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
