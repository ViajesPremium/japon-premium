"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "./itinerary.module.css";
import GradientText from "@/components/ui/GradientText";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import { Button } from "@/components/ui/button";

const items = [
  {
    id: 1,
    day: "14 DÍAS · ESPIRITUALIDAD · TRADICIÓN · Bienestar · Cultura",
    title: "Alma de Japón",
    description:
      "Un recorrido por el Japón más espiritual y profundo: templos milenarios, rutas sagradas, ryokans, onsen y experiencias que transforman el viaje.",
    ideal:
      "'' Ideal para parejas, familias, lunas de miel y viajeros que buscan desconexión profunda. ''",
    price: "Desde $1,999 USD",
    image1: "/images/hotel-jp.webp",
    image2: "/images/tren-jp.webp",
  },
  {
    id: 2,
    day: "Modernidad",
    title: "Titanes del pacífico",
    description:
      "Visita Senso-ji al amanecer antes de que lleguen los turistas. Tarde en los jardines imperiales de Shinjuku-gyoen.",
    ideal:
      "Ideal para viajeros que buscan contrastes urbanos, arquitectura contemporanea y ritmo cosmopolita.",
    price: "Desde $2,390 USD",
    image1: "/images/kyoto.webp",
    image2: "/images/turismo-1.webp",
  },
  {
    id: 3,
    day: "Aventura",
    title: "La montaña sagrada",
    description:
      "Desayuno kaiseki en el hotel. Mercado Tsukiji para almorzar y cena omakase en restaurante con estrella Michelin.",
    ideal:
      "Ideal para quienes quieren naturaleza activa, rutas panoramicas y experiencias fuera de lo convencional.",
    price: "Desde $2,790 USD",
    image1: "/images/buffet-jp.webp",
    image2: "/images/turismo-2.webp",
  },
];

export default function Itinerary() {
  const containerRef = useRef<HTMLDivElement>(null);
  const c1Refs = useRef<(HTMLDivElement | null)[]>([]);
  const c2Refs = useRef<(HTMLDivElement | null)[]>([]);
  const infoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeStep, setActiveStep] = useState(0);
  const navRef = useRef<{ go: (dir: number) => void } | null>(null);
  const currentStepRef = useRef(0);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const total = items.length;
      const c1 = c1Refs.current;
      const c2 = c2Refs.current;
      const info = infoRefs.current;

      type LenisLike = { scrollTo: (target: number, opts: object) => void };
      const getLenis = () =>
        (window as unknown as Record<string, LenisLike>).__lenis;

      const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
      const SCRUB_SMOOTHNESS = isMobileViewport ? 0.08 : 0.12;
      const SNAP_MIN_DURATION = isMobileViewport ? 0.02 : 0.03;
      const SNAP_MAX_DURATION = isMobileViewport ? 0.07 : 0.09;
      const SNAP_DELAY = isMobileViewport ? 0.12 : 0.25;
      const ENTRY_HOLD_VH = isMobileViewport ? 0.45 : 1;
      const REVEAL_PIN_VH = isMobileViewport ? 0.4 : 1;
      const TRANSITION_UNITS = total - 1;
      const TOTAL_UNITS = ENTRY_HOLD_VH + TRANSITION_UNITS + REVEAL_PIN_VH;
      const getTotalPinDistance = () => window.innerHeight * TOTAL_UNITS;
      const getTransitionStartProgress = () => ENTRY_HOLD_VH / TOTAL_UNITS;
      const getTransitionEndProgress = () =>
        (ENTRY_HOLD_VH + TRANSITION_UNITS) / TOTAL_UNITS;

      let lastDirection = 1;

      // ── Estado inicial ─────────────────────────────────────────────────
      items.forEach((_, i) => {
        if (i === 0) {
          gsap.set(c1[i], { yPercent: 0, zIndex: 1, force3D: true });
          gsap.set(c2[i], { yPercent: 0, zIndex: 1, force3D: true });
          gsap.set(info[i], { yPercent: 0, opacity: 1, force3D: true });
        } else {
          gsap.set(c1[i], { yPercent: 100, zIndex: i + 1, force3D: true });
          gsap.set(c2[i], { yPercent: -100, zIndex: i + 1, force3D: true });
          // Ajustado a 20% para que el deslizamiento del texto sea más sutil y premium
          gsap.set(info[i], { yPercent: 20, opacity: 0, force3D: true });
        }
      });

      const interiorStops = Array.from(
        { length: total },
        (_, i) => (ENTRY_HOLD_VH + i) / TOTAL_UNITS,
      );
      const stops = [0, ...interiorStops, 1];

      const closestStop = (value: number) =>
        stops.reduce((closest, stop) =>
          Math.abs(stop - value) < Math.abs(closest - value) ? stop : closest,
        );

      const closestInteriorStopIndex = (value: number) => {
        let bestIndex = 0;
        let bestDistance = Number.POSITIVE_INFINITY;

        for (let i = 0; i < interiorStops.length; i++) {
          const distance = Math.abs(interiorStops[i] - value);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = i;
          }
        }

        return bestIndex;
      };

      // ── Timeline principal ──────────────────────────────────────────────
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${getTotalPinDistance()}`,
          pin: true,
          pinSpacing: true,
          scrub: SCRUB_SMOOTHNESS,
          snap: {
            // Mobile: siempre avanza/retrocede por direccion de gesto
            // sin exigir pasar el 50% del tramo.
            snapTo: (value: number) => {
              if (!isMobileViewport) return closestStop(value);

              const firstInterior = interiorStops[0];
              const lastInterior = interiorStops[interiorStops.length - 1];
              const edgeThreshold = 0.02;
              const restThreshold = 0.003;

              // Evita iniciar antes de tiempo o quedarse pegado al final.
              if (value < firstInterior - edgeThreshold) return 0;
              if (value > lastInterior + edgeThreshold) return 1;

              const currentIndex = closestInteriorStopIndex(value);
              const currentStop = interiorStops[currentIndex];

              // Si ya estamos en reposo sobre un stop, no forzar otro salto.
              if (Math.abs(value - currentStop) < restThreshold) {
                return currentStop;
              }

              if (lastDirection > 0) {
                if (currentIndex >= interiorStops.length - 1) return 1;
                return interiorStops[currentIndex + 1];
              }

              if (lastDirection < 0) {
                if (currentIndex <= 0) return 0;
                return interiorStops[currentIndex - 1];
              }

              return currentStop;
            },
            duration: { min: SNAP_MIN_DURATION, max: SNAP_MAX_DURATION },
            delay: SNAP_DELAY,
            ease: "power3.out",
            inertia: false,
          },
          onUpdate: (self) => {
            if (self.direction !== 0) {
              lastDirection = self.direction;
            }

            const transitionStart = getTransitionStartProgress();
            const transitionEnd = getTransitionEndProgress();
            const transitionProgress = Math.min(
              Math.max(self.progress - transitionStart, 0) /
                (transitionEnd - transitionStart),
              1,
            );
            const step = Math.round(transitionProgress * (total - 1));
            if (step !== currentStepRef.current) {
              currentStepRef.current = step;
              setActiveStep(step);
            }
          },
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < total; i++) {
        const pos = ENTRY_HOLD_VH + (i - 1);

        masterTl.to(c1[i], { yPercent: 0, ease: "none", duration: 1 }, pos);
        masterTl.to(c2[i], { yPercent: 0, ease: "none", duration: 1 }, pos);

        masterTl.to(
          info[i - 1],
          { yPercent: -20, opacity: 0, ease: "none", duration: 0.4 },
          pos,
        );

        masterTl.to(
          info[i],
          { yPercent: 0, opacity: 1, ease: "none", duration: 0.4 },
          pos + 0.6,
        );
      }

      // Hold de entrada: la seccion ya esta visible, pero aun no transiciona.
      masterTl.to({}, { duration: ENTRY_HOLD_VH }, 0);
      // Hold de salida para el efecto de reveal de la siguiente seccion.
      masterTl.to(
        {},
        { duration: REVEAL_PIN_VH },
        ENTRY_HOLD_VH + TRANSITION_UNITS,
      );

      // ── Botones de navegación ──────────────────────────────────────────
      navRef.current = {
        go: (dir: number) => {
          const to = Math.max(
            0,
            Math.min(total - 1, currentStepRef.current + dir),
          );
          if (to === currentStepRef.current) return;

          const st = masterTl.scrollTrigger;
          if (!st) return;

          const targetProgress = (ENTRY_HOLD_VH + to) / TOTAL_UNITS;
          const targetScroll = st.start + targetProgress * (st.end - st.start);
          const lenis = getLenis();

          if (lenis) {
            lenis.scrollTo(targetScroll, {
              duration: isMobileViewport ? 0.32 : 0.45,
            });
          } else {
            window.scrollTo({ top: targetScroll, behavior: "smooth" });
          }
        },
      };

      return () => {
        masterTl.scrollTrigger?.kill();
        masterTl.kill();
        navRef.current = null;
      };
    },
    { scope: containerRef },
  );

  return (
    <div className={styles.container} ref={containerRef}>
      {/* ── Imágenes Izquierda ── */}
      <div className={styles.content1}>
        {items.map((item, i) => (
          <div
            key={`${item.id}-content1`}
            ref={(el) => {
              c1Refs.current[i] = el;
            }}
            className={styles.imageFrame}
          >
            <Image
              src={item.image1}
              alt={item.title}
              className={styles.image}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* ── Imágenes Derecha ── */}
      <div className={styles.content2}>
        {items.map((item, i) => (
          <div
            key={`${item.id}-content2`}
            ref={(el) => {
              c2Refs.current[i] = el;
            }}
            className={styles.imageFrame}
          >
            <Image
              src={item.image2}
              alt={item.title}
              className={styles.image}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* ── Card Central Premium ── */}
      <div className={styles.premiumCard}>
        <div className={styles.cardOverlay} />

        <div className={styles.contentWrapper}>
          {/* Textos que se deslizan */}
          <div className={styles.infoContainer}>
            {items.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => {
                  infoRefs.current[i] = el;
                }}
                className={`${styles.infoItem} ${
                  activeStep === i ? styles.active : ""
                }`}
              >
                <div className={styles.header}>
                  <span className={styles.eyebrow}>{item.day}</span>
                  <GradientText
                    className={styles.titleGradient}
                    colors={["#BF953F", "#FCF6BA", "#B38728", "#FCF6BA"]}
                    animationSpeed={6}
                    direction="horizontal"
                  >
                    <h2 className={styles.titleText}>{item.title}</h2>
                  </GradientText>
                </div>

                <div className={styles.body}>
                  <BlurredStagger
                    text={item.description}
                    className={styles.descriptionBlur}
                    isActive={activeStep === i}
                  />
                  <p className={styles.idealText}>{item.ideal}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Fijo de la Card */}
          <div className={styles.cardFooter}>
            <div className={styles.buttons}>
              <Button variant="secondary" className={styles.ctaButton2}>
                Descargar PDF
              </Button>
              <Button variant="primary" className={styles.ctaButton}>
                Quiero esta experiencia
              </Button>
            </div>

            <div className={styles.controls}>
              <div className={styles.counterGroup}>
                <span className={styles.current}>
                  {String(activeStep + 1).padStart(2, "0")}
                </span>
                <div className={styles.divider} />
                <span className={styles.total}>
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>
              <div className={styles.priceSlot}>
                <span className={styles.priceVertical}>
                  {items[activeStep].price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
