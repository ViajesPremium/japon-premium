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
    day: "Espiritual",
    title: "El camino de Kumano",
    description:
      "Aterriza en Narita y sumérgete en el caos luminoso de Shinjuku. Primera noche en un ryokan urbano con vistas a la ciudad.",
    image1: "/images/hotel-jp.webp",
    image2: "/images/tren-jp.webp",
  },
  {
    id: 2,
    day: "Modernidad",
    title: "Titanes del pacífico",
    description:
      "Visita Senso-ji al amanecer antes de que lleguen los turistas. Tarde en los jardines imperiales de Shinjuku-gyoen.",
    image1: "/images/kyoto.webp",
    image2: "/images/turismo-1.webp",
  },
  {
    id: 3,
    day: "Aventura",
    title: "La montaña sagrada",
    description:
      "Desayuno kaiseki en el hotel. Mercado Tsukiji para almorzar y cena omakase en restaurante con estrella Michelin.",
    image1: "/images/buffet-jp.webp",
    image2: "/images/turismo-2.webp",
  },
];

const DURATION = 0.65;

export default function Itinerary() {
  const containerRef = useRef<HTMLDivElement>(null);
  const c1Refs = useRef<(HTMLDivElement | null)[]>([]);
  const c2Refs = useRef<(HTMLDivElement | null)[]>([]);
  const infoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeStep, setActiveStep] = useState(0);
  const navRef = useRef<{ go: (dir: number) => void } | null>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const total = items.length;
      const c1 = c1Refs.current;
      const c2 = c2Refs.current;
      const info = infoRefs.current;

      // Helper para obtener lenis sin repetir código
      type LenisLike = { scrollTo: (target: number, opts: object) => void };
      const getLenis = () =>
        (window as unknown as Record<string, LenisLike>).__lenis;

      // ── Estado inicial ─────────────────────────────────────────────────
      items.forEach((_, i) => {
        if (i === 0) {
          gsap.set(c1[i], { yPercent: 0, zIndex: 2, force3D: true });
          gsap.set(c2[i], { yPercent: 0, zIndex: 2, force3D: true });
          gsap.set(info[i], { yPercent: 0, opacity: 1, force3D: true });
        } else {
          gsap.set(c1[i], { yPercent: 100, zIndex: 0, force3D: true });
          gsap.set(c2[i], { yPercent: -100, zIndex: 0, force3D: true });
          gsap.set(info[i], { yPercent: 40, opacity: 0, force3D: true });
        }
      });

      // ── Banderas de control de estado ──────────────────────────────────
      let isAnimating = false;
      let isNavigating = false; // NUEVO: Evita conflictos al usar los botones
      let safetyTimer: ReturnType<typeof setTimeout> | null = null;
      let currentStepInternal = 0;

      const goToStep = (to: number) => {
        if (to === currentStepInternal) return;

        isAnimating = true;
        const from = currentStepInternal;
        const dir = to > from ? 1 : -1;

        currentStepInternal = to;
        setActiveStep(to);

        if (safetyTimer) clearTimeout(safetyTimer);
        safetyTimer = setTimeout(
          () => {
            isAnimating = false;
          },
          (DURATION + 0.3) * 1000,
        );

        items.forEach((_, i) => {
          if (i === to) {
            gsap.set([c1[i], c2[i]], { zIndex: 2 });
            const startY1 = dir === 1 ? 100 : -100;
            const startY2 = dir === 1 ? -100 : 100;

            gsap.fromTo(
              c1[i],
              { yPercent: startY1 },
              {
                yPercent: 0,
                duration: DURATION,
                ease: "power2.inOut",
                overwrite: "auto",
                force3D: true,
              },
            );
            gsap.fromTo(
              c2[i],
              { yPercent: startY2 },
              {
                yPercent: 0,
                duration: DURATION,
                ease: "power2.inOut",
                overwrite: "auto",
                force3D: true,
              },
            );

            gsap.to(info[i], {
              yPercent: 0,
              opacity: 1,
              duration: DURATION * 0.55,
              ease: "power2.out",
              delay: DURATION * 0.45,
              overwrite: "auto",
              force3D: true,
              onComplete: () => {
                if (safetyTimer) clearTimeout(safetyTimer);
                isAnimating = false;
              },
            });
          } else if (i === from) {
            gsap.set([c1[i], c2[i]], { zIndex: 1 });
            gsap.to(c1[i], {
              yPercent: 0,
              duration: DURATION,
              ease: "power2.inOut",
              overwrite: "auto",
              force3D: true,
            });
            gsap.to(c2[i], {
              yPercent: 0,
              duration: DURATION,
              ease: "power2.inOut",
              overwrite: "auto",
              force3D: true,
            });

            const infoY = dir === 1 ? -40 : 40;
            gsap.to(info[i], {
              yPercent: infoY,
              opacity: 0,
              duration: DURATION * 0.55,
              ease: "power2.in",
              overwrite: "auto",
              force3D: true,
            });
          } else {
            gsap.set(c1[i], { yPercent: i > to ? 100 : -100, zIndex: 0 });
            gsap.set(c2[i], { yPercent: i > to ? -100 : 100, zIndex: 0 });
            gsap.set(info[i], { opacity: 0 });
          }
        });
      };

      // ── Pin y Detección de Scroll ──────────────────────────────────────
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${window.innerHeight * (total - 1)}`,
        pin: true,
        pinSpacing: true,
        snap: {
          snapTo: 1 / (total - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1,
        },
        onUpdate: (self) => {
          if (isNavigating) return; // Ignoramos si la animación vino de un botón

          const targetStep = Math.round(self.progress * (total - 1));

          if (targetStep !== currentStepInternal) {
            if (isAnimating) {
              // NUEVO: BLOQUEO ESTRICTO DE SCROLL
              // Si está animando, calculamos la posición exacta del paso actual y forzamos
              // al scroll a quedarse ahí. Esto cancela el momentum e impide saltar pasos.
              const safeScroll =
                self.start +
                (currentStepInternal / (total - 1)) * (self.end - self.start);
              const lenis = getLenis();

              if (lenis) {
                lenis.scrollTo(safeScroll, { immediate: true });
              } else {
                self.scroll(safeScroll);
              }
              return;
            }

            // NUEVO: FORZAR PROGRESIÓN DE 1 EN 1
            // Aunque el usuario haga un scroll gigante que lo lleve al paso 3 de golpe,
            // solo lo dejamos avanzar +1 o -1
            const dir = targetStep > currentStepInternal ? 1 : -1;
            const nextStep = currentStepInternal + dir;

            goToStep(nextStep);
          }
        },
      });

      // ── Exponer goToStep a los botones ─────────────────────────────────
      navRef.current = {
        go: (dir: number) => {
          if (isAnimating || isNavigating) return;
          const to = Math.max(
            0,
            Math.min(total - 1, currentStepInternal + dir),
          );
          if (to === currentStepInternal) return;

          isNavigating = true;
          goToStep(to); // Ejecutamos la animación visual de inmediato

          const lenis = getLenis();
          const targetScroll =
            st.start + (to / (total - 1)) * (st.end - st.start);

          if (lenis) {
            lenis.scrollTo(targetScroll, { duration: 1 });
          } else {
            window.scrollTo({ top: targetScroll, behavior: "smooth" });
          }

          // Liberamos la bandera una vez que termine el auto-scroll
          setTimeout(() => {
            isNavigating = false;
          }, 1000);
        },
      };

      return () => {
        if (safetyTimer) clearTimeout(safetyTimer);
        navRef.current = null;
      };
    },
    { scope: containerRef },
  );

  return (
    <div className={styles.container} ref={containerRef}>
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

      <div className={styles.itineraryInfo}>
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              infoRefs.current[i] = el;
            }}
            className={styles.infoItem}
          >
            <GradientText
              className={styles.titleGradient}
              colors={["#BF953F", "#FCF6BA", "#B38728", "#FCF6BA"]}
              animationSpeed={6}
              direction="horizontal"
            >
              <span className={styles.titleText}>{item.title}</span>
            </GradientText>
            <BlurredStagger
              text={item.description}
              className={styles.descriptionBlur}
              isActive={activeStep === i}
            />
          </div>
        ))}

        {/* Botón estático fuera del map — evita que items invisibles bloqueen el hover */}
        <Button variant="primary" className={styles.buttonInfo}>
          Más información
        </Button>

        <div className={styles.navButtons}>
          <button
            className={styles.navBtn}
            onClick={() => navRef.current?.go(-1)}
            disabled={activeStep === 0}
            aria-label="Anterior"
          >
            ↑
          </button>
          <button
            className={styles.navBtn}
            onClick={() => navRef.current?.go(1)}
            disabled={activeStep === items.length - 1}
            aria-label="Siguiente"
          >
            ↓
          </button>
        </div>

        <span className={styles.stepCounter}>
          {String(activeStep + 1).padStart(2, "0")}
          <span className={styles.stepTotal}>
            /{String(items.length).padStart(2, "0")}
          </span>
        </span>
      </div>
    </div>
  );
}
