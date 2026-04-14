"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";

type SmoothScrollProps = {
  children: React.ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
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
    });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);

    // Snap suave general
    let isSnapping = false;
    let snapTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Absorbemos la inercia del scroll después del snap
      if (isSnapping) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // 1. Snap para el hero (más permisivo)
      if (scrollY > 10 && scrollY < heroHeight - 10) {
        isSnapping = true;
        if (e.cancelable) e.preventDefault();
        const target = e.deltaY > 0 ? heroHeight : 0;
        lenis.scrollTo(target, {
          duration: 1.4,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
          lock: true,
          onComplete: () => {
            snapTimeout = setTimeout(() => {
              isSnapping = false;
            }, 400);
          },
        });
        return;
      }

      // 2. Snap para cualquier otra sección con la clase 'snap-section'
      const snapSections = Array.from(
        document.querySelectorAll(".snap-section"),
      );

      let targetSection = null;
      let minDistance = Infinity;
      const threshold = window.innerHeight * 0.3; // Bajamos el umbral al 30%

      for (const section of snapSections) {
        const rect = section.getBoundingClientRect();

        // Si escroleamos hacia abajo y nos acercamos al top de una sección
        if (e.deltaY > 0 && rect.top > 10 && rect.top < threshold) {
          if (rect.top < minDistance) {
            minDistance = rect.top;
            targetSection = section;
          }
        }

        // Si escroleamos hacia arriba y nos acercamos al inicio de la sección desde abajo
        if (e.deltaY < 0 && rect.top < -10 && Math.abs(rect.top) < threshold) {
          if (Math.abs(rect.top) < minDistance) {
            minDistance = Math.abs(rect.top);
            targetSection = section;
          }
        }
      }

      if (targetSection) {
        isSnapping = true;
        if (e.cancelable) e.preventDefault();
        lenis.scrollTo(targetSection as HTMLElement, {
          duration: 1.1,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
          lock: true,
          onComplete: () => {
            // Cooldown de 400ms reducido
            snapTimeout = setTimeout(() => {
              isSnapping = false;
            }, 400);
          },
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
