"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollProps = {
  children: React.ReactNode;
};

type LenisInstance = InstanceType<typeof Lenis>;

declare global {
  interface Window {
    __lenis?: LenisInstance;
  }
}

const MAX_WHEEL_DELTA = 56;
const MAX_TOUCH_DELTA = 24;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      // Low lerp + delta cap keeps the scroll very smooth and controlled.
      lerp: 0.045,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.06,
      touchInertiaExponent: 1.2,
      touchMultiplier: 0.35,
      wheelMultiplier: 0.45,
      orientation: "vertical",
      gestureOrientation: "vertical",
      autoResize: true,
      infinite: false,
      overscroll: false,
      virtualScroll: (data) => {
        const maxDelta = data.event.type.startsWith("touch")
          ? MAX_TOUCH_DELTA
          : MAX_WHEEL_DELTA;

        data.deltaY = clamp(data.deltaY, -maxDelta, maxDelta);
        data.deltaX = 0;
        return true;
      },
    });

    // Puente crítico: mantiene ScrollTrigger en sincronía con la
    // posición interpolada de Lenis en cada frame.
    lenis.on("scroll", ScrollTrigger.update);

    // Cuando ScrollTrigger refresca (resize, pin recalc…), Lenis
    // recalcula su scroll limit para que no queden desajustes.
    const handleRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    // Exponer instancia para que secciones con scroll programático
    // (itinerary, nav) puedan llamar a lenis.scrollTo directamente.
    window.__lenis = lenis;

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(update);

    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;

      const tagName = target.tagName;
      return (
        tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT"
      );
    };

    const handleKeyboardScroll = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }
      if (isEditableTarget(event.target)) return;

      const key = event.key;
      const isArrow = key === "ArrowDown" || key === "ArrowUp";
      const isPage = key === "PageDown" || key === "PageUp" || key === " ";
      const isEdge = key === "Home" || key === "End";

      if (!isArrow && !isPage && !isEdge) return;
      if (event.cancelable) event.preventDefault();

      if (key === "Home") {
        lenis.scrollTo(0, { duration: 1.3, easing: easeOutQuint });
        return;
      }

      if (key === "End") {
        lenis.scrollTo(lenis.limit, { duration: 1.6, easing: easeOutQuint });
        return;
      }

      const direction = key === "ArrowUp" || key === "PageUp" ? -1 : 1;
      const step = window.innerHeight * (isPage ? 0.45 : 0.14);
      const next = clamp(lenis.targetScroll + direction * step, 0, lenis.limit);

      lenis.scrollTo(next, {
        duration: isPage ? 1.1 : 0.9,
        easing: easeOutQuint,
      });
    };

    window.addEventListener("keydown", handleKeyboardScroll, {
      passive: false,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyboardScroll);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
