"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SmoothScrollProps = { children: React.ReactNode };

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ── Móvil: scroll nativo, sin Lenis ──────────────────────────────────
    // Lenis no aporta nada en táctil y añade overhead. ScrollTrigger funciona
    // perfectamente con scroll nativo.
    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (isTouch) {
      (window as unknown as Record<string, unknown>).__lenis = null;
      setTimeout(() => ScrollTrigger.refresh(), 600);
      const onResize = () => setTimeout(() => ScrollTrigger.refresh(), 350);
      window.addEventListener("resize", onResize, { passive: true });
      return () => window.removeEventListener("resize", onResize);
    }

    // ── Desktop: Lenis ────────────────────────────────────────────────────
    const lenis = new Lenis({
      lerp: 0.1,           // Valor canónico — fluido sin ser lento
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.0,
    });

    (window as unknown as Record<string, unknown>).__lenis = lenis;

    // Conexión canónica: GSAP ticker → Lenis RAF
    lenis.on("scroll", ScrollTrigger.update);
    const rafCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCb);
    gsap.ticker.lagSmoothing(0);

    // Refresh de ScrollTrigger solo al resize (NO en body resize ni en scroll)
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 300);
    };
    window.addEventListener("resize", onResize, { passive: true });
    // Refresh inicial después de que los assets empujen el DOM
    setTimeout(() => ScrollTrigger.refresh(), 600);

    // ── Snap a secciones ──────────────────────────────────────────────────
    // Regla: solo snappear si el borde de una sección está a menos del 38% del
    // viewport. Si el usuario está en medio del contenido, no tocamos nada.
    let snapTimer: ReturnType<typeof setTimeout> | null = null;
    let isSnapping = false;

    const trySnap = (scroll: number) => {
      if (isSnapping) return;

      const vh = window.innerHeight;
      const THRESHOLD = vh * 0.38;
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(".snap-section"),
      );

      let bestTarget: number | null = null;
      let bestDist = Infinity;

      for (const s of sections) {
        // getBoundingClientRect().top = distancia desde el borde superior del
        // viewport al borde superior de la sección (negativo = ya pasamos).
        const top = s.getBoundingClientRect().top;
        const dist = Math.abs(top);
        if (dist > THRESHOLD) continue; // estamos demasiado lejos → no snap
        if (dist < bestDist) {
          bestDist = dist;
          // Posición absoluta de la sección = posición actual + offset visual
          bestTarget = scroll + top;
        }
      }

      // Ya estamos en el inicio (< 5px de tolerancia)
      if (bestTarget === null || bestDist < 5) return;

      isSnapping = true;
      lenis.scrollTo(bestTarget, {
        duration: 0.85,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          setTimeout(() => { isSnapping = false; }, 150);
        },
      });
    };

    lenis.on(
      "scroll",
      ({ scroll, velocity }: { scroll: number; velocity: number }) => {
        // Mientras haya velocidad significativa, cancelar cualquier snap pendiente
        if (Math.abs(velocity) > 0.06) {
          if (snapTimer) { clearTimeout(snapTimer); snapTimer = null; }
          return;
        }
        // Una vez que la velocidad cae, programar el snap con un pequeño delay
        if (snapTimer || isSnapping) return;
        snapTimer = setTimeout(() => {
          snapTimer = null;
          trySnap(scroll);
        }, 200);
      },
    );

    return () => {
      if (snapTimer) clearTimeout(snapTimer);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(rafCb);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
