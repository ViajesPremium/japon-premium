"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./itinerary.module.css";
import GradientText from "@/components/ui/GradientText";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";

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
  const c1Refs = useRef<(HTMLImageElement | null)[]>([]);
  const c2Refs = useRef<(HTMLImageElement | null)[]>([]);
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

      // ── Función que anima el cambio de step ────────────────────────────
      let isAnimating = false;
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
            // ELEMENTO ENTRANTE (CORTINA)
            gsap.set([c1[i], c2[i]], { zIndex: 2 });

            const startY1 = dir === 1 ? 100 : -100;
            const startY2 = dir === 1 ? -100 : 100;

            // force3D: true obliga a usar aceleración por GPU
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
            // ELEMENTO SALIENTE (QUEDA DEBAJO)
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
            // ELEMENTOS EN ESPERA (Se reacomodan sin animación pesada)
            gsap.set(c1[i], { yPercent: i > to ? 100 : -100, zIndex: 0 });
            gsap.set(c2[i], { yPercent: i > to ? -100 : 100, zIndex: 0 });
            gsap.set(info[i], { opacity: 0 });
          }
        });
      };

      // ── Pin y Detección de Scroll Nativa ────────
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
          const nextStep = Math.round(self.progress * (total - 1));
          if (nextStep !== currentStepInternal) {
            goToStep(nextStep);
          }
        },
      });

      // ── Exponer goToStep a los botones ─────────────────────────────────
      navRef.current = {
        go: (dir: number) => {
          if (isAnimating) return;
          const to = Math.max(
            0,
            Math.min(total - 1, currentStepInternal + dir),
          );
          if (to === currentStepInternal) return;

          type LenisLike = { scrollTo: (target: number, opts: object) => void };
          const lenis = (window as unknown as Record<string, LenisLike>)
            .__lenis;

          const targetScroll =
            st.start + (to / (total - 1)) * (st.end - st.start);

          if (lenis) {
            lenis.scrollTo(targetScroll, { duration: 1 });
          } else {
            window.scrollTo({ top: targetScroll, behavior: "smooth" });
          }
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
          <img
            key={item.id}
            ref={(el) => {
              c1Refs.current[i] = el;
            }}
            src={item.image1}
            alt={item.title}
            className={styles.image}
            decoding="async"
            // Solo carga ansiosamente la primera imagen para el LCP, las demás lazy load
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        ))}
      </div>

      <div className={styles.content2}>
        {items.map((item, i) => (
          <img
            key={item.id}
            ref={(el) => {
              c2Refs.current[i] = el;
            }}
            src={item.image2}
            alt={item.title}
            className={styles.image}
            decoding="async"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
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
            <span className={styles.day}>{item.day}</span>
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
