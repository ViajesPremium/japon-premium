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

const toRoman = (value: number) => {
  const numerals: Array<[number, string]> = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let remainder = Math.max(1, Math.floor(value));
  let output = "";

  for (const [arabic, roman] of numerals) {
    while (remainder >= arabic) {
      output += roman;
      remainder -= arabic;
    }
  }

  return output;
};

const items = [
  {
    id: 1,
    day: "14 DÍAS · ESPIRITUALIDAD · TRADICIÓN · Bienestar · Cultura",
    title: "Alma de Japón",
    description:
      "Un recorrido por el Japón más espiritual y profundo: templos milenarios, rutas sagradas, ryokans, onsen y experiencias que transforman el viaje.",
    ideal:
      "Ideal para parejas, familias, lunas de miel y viajeros que buscan desconexión profunda.",
    image1: "/images/hotel-jp.webp",
    image2: "/images/tren-jp.webp",
  },
  {
    id: 2,
    day: "14 DÍAS · ANIME · PARQUES TEMÁTICOS · TECNOLOGÍA · CULTURA POP",
    title: "Japón Pop",
    description:
      "Un recorrido por el Japón más vibrante y fantástico: anime, parques temáticos, tecnología, neón, tradición y experiencias que transforman el viaje.",
    ideal:
      "Ideal para familias, amigos, parejas jóvenes, fans del anime, manga y la tecnología.",
    image1: "/images/kyoto.webp",
    image2: "/images/turismo-1.webp",
  },
  {
    id: 3,
    day: "15 DÍAS · SAMURÁIS · GEISHAS · SUMO · ALPES JAPONESES",
    title: "El Camino del Shōgun",
    description:
      "Un recorrido por el Japón más auténtico y menos transitado: alpes japoneses, templos zen, ryokans y santuarios sagrados que transforman el viaje.",
    ideal:
      "Ideal para parejas aventureras, viajeros con mirada cultural y quienes prefieren el Japón que pocos conocen.",
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
      // Mobile: más damping (scrub más lento) para que swipes rápidos
      // no salten varios itinerarios de golpe.
      const SCRUB_SMOOTHNESS = isMobileViewport ? 0.28 : 0.12;
      const SNAP_MIN_DURATION = isMobileViewport ? 0.28 : 0.03;
      const SNAP_MAX_DURATION = isMobileViewport ? 0.52 : 0.09;
      const SNAP_DELAY = isMobileViewport ? 0.05 : 0.25;
      const ENTRY_HOLD_VH = isMobileViewport ? 0.45 : 1;
      const REVEAL_PIN_VH = isMobileViewport ? 0.4 : 1;
      const TRANSITION_UNITS = total - 1;
      const TOTAL_UNITS = ENTRY_HOLD_VH + TRANSITION_UNITS + REVEAL_PIN_VH;
      const getTotalPinDistance = () => window.innerHeight * TOTAL_UNITS;
      const getTransitionStartProgress = () => ENTRY_HOLD_VH / TOTAL_UNITS;
      const getTransitionEndProgress = () =>
        (ENTRY_HOLD_VH + TRANSITION_UNITS) / TOTAL_UNITS;

      let lastDirection = 1;
      // Captura el step ANTES de que el usuario empiece a deslizar.
      // snapTo usa este valor para garantizar máximo un paso por gesto.
      let touchStartStep = 0;

      // ── Estado inicial ─────────────────────────────────────────────────
      items.forEach((_, i) => {
        if (i === 0) {
          gsap.set(c1[i], { yPercent: 0, zIndex: 1, force3D: true });
          // c2[0] siempre se inicializa — mobile o desktop
          gsap.set(c2[i], { yPercent: 0, zIndex: 1, force3D: true });
          gsap.set(info[i], { yPercent: 0, opacity: 1, force3D: true });
        } else {
          gsap.set(c1[i], { yPercent: 100, zIndex: i + 1, force3D: true });
          // Tanto en desktop como en mobile, c2 entra desde arriba (-100)
          // mientras c1 entra desde abajo (100) → efecto split opuesto en ambos layouts.
          // En mobile (columna): c1 sube al panel superior, c2 baja al panel inferior.
          gsap.set(c2[i], {
            yPercent: -100,
            zIndex: i + 1,
            force3D: true,
          });
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
            snapTo: (value: number) => {
              if (!isMobileViewport) return closestStop(value);

              const firstInterior = interiorStops[0];
              const lastInterior = interiorStops[interiorStops.length - 1];

              // Bordes: antes del primer itinerario o después del último
              if (value < firstInterior - 0.02) return 0;
              if (value > lastInterior + 0.02) return 1;

              // Mobile: usa el step capturado en touchstart (ANTES del gesto),
              // no currentStepRef que ya se actualiza durante el scroll.
              // Así un swipe rápido avanza exactamente UN itinerario siempre.
              const step = touchStartStep;
              const currentStop = interiorStops[step];

              // Ya en reposo — no mover
              if (Math.abs(value - currentStop) < 0.003) return currentStop;

              if (lastDirection > 0) {
                // Avanzar exactamente un paso
                const next = Math.min(step + 1, interiorStops.length - 1);
                // Si ya estamos en el último interior, ir al final
                if (next === interiorStops.length - 1 && value > lastInterior)
                  return 1;
                return interiorStops[next];
              }

              if (lastDirection < 0) {
                // Retroceder exactamente un paso
                const prev = Math.max(step - 1, 0);
                if (prev === 0 && value < firstInterior) return 0;
                return interiorStops[prev];
              }

              return currentStop;
            },
            duration: { min: SNAP_MIN_DURATION, max: SNAP_MAX_DURATION },
            delay: SNAP_DELAY,
            ease: "power2.out",
            inertia: false,
          },
          onUpdate: (self) => {
            if (self.direction !== 0) lastDirection = self.direction;

            // Fast-path: fuera del rango de transición no hay cambio de step
            const p = self.progress;
            if (p <= transitionStartProg || p >= transitionEndProg) return;

            // Usa valores cacheados — sin recalcular en cada frame
            const transitionProgress = (p - transitionStartProg) / transitionRange;
            const step = Math.round(
              Math.min(transitionProgress, 1) * (total - 1),
            );
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

      // Caché de rangos — se calculan una sola vez en lugar de en cada
      // frame de scroll dentro de onUpdate (que puede dispararse a 60fps).
      const transitionStartProg = getTransitionStartProgress();
      const transitionEndProg = getTransitionEndProgress();
      const transitionRange = transitionEndProg - transitionStartProg;

      // ── Captura del step al inicio del gesto táctil ───────────────────
      // Debe registrarse DESPUÉS del setup del timeline para que
      // currentStepRef esté listo cuando touchstart dispare.
      let cleanupTouch: (() => void) | null = null;
      if (isMobileViewport && containerRef.current) {
        const el = containerRef.current;
        const onTouchStart = () => {
          touchStartStep = currentStepRef.current;
        };
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        cleanupTouch = () => el.removeEventListener("touchstart", onTouchStart);
      }

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
        cleanupTouch?.();
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
                  {toRoman(activeStep + 1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
