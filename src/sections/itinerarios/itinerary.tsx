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

      const SCRUB_SMOOTHNESS = 0.12;
      const SNAP_MIN_DURATION = 0.03;
      const SNAP_MAX_DURATION = 0.09;

      // ── Estado inicial ─────────────────────────────────────────────────
      // Items posteriores tienen z-index mayor: al deslizarse cubren al anterior.
      items.forEach((_, i) => {
        if (i === 0) {
          gsap.set(c1[i], { yPercent: 0, zIndex: 1, force3D: true });
          gsap.set(c2[i], { yPercent: 0, zIndex: 1, force3D: true });
          gsap.set(info[i], { yPercent: 0, opacity: 1, force3D: true });
        } else {
          gsap.set(c1[i], { yPercent: 100, zIndex: i + 1, force3D: true });
          gsap.set(c2[i], { yPercent: -100, zIndex: i + 1, force3D: true });
          gsap.set(info[i], { yPercent: 40, opacity: 0, force3D: true });
        }
      });

      // ── Timeline principal — scrubbed por scroll ───────────────────────
      // Cada transición ocupa 1 unidad en el timeline.
      // El scroll mueve el progreso directamente, sin animaciones con duración propia.
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (total - 1)}`,
          pin: true,
          pinSpacing: true,
          scrub: SCRUB_SMOOTHNESS,
          snap: {
            snapTo: (value: number) =>
              Math.round(value * (total - 1)) / (total - 1),
            duration: { min: SNAP_MIN_DURATION, max: SNAP_MAX_DURATION },
            delay: 0,
            ease: "power3.out",
            inertia: false,
          },
          onUpdate: (self) => {
            const step = Math.round(self.progress * (total - 1));
            if (step !== currentStepRef.current) {
              currentStepRef.current = step;
              setActiveStep(step);
            }
          },
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < total; i++) {
        const pos = i - 1; // posición de inicio en el timeline

        // Imágenes entrantes se deslizan hasta cubrirla anterior
        masterTl.to(c1[i], { yPercent: 0, ease: "none", duration: 1 }, pos);
        masterTl.to(c2[i], { yPercent: 0, ease: "none", duration: 1 }, pos);

        // Info saliente: sale en la primera mitad de la transición
        masterTl.to(
          info[i - 1],
          { yPercent: -40, opacity: 0, ease: "none", duration: 0.4 },
          pos,
        );

        // Info entrante: aparece en la segunda mitad
        masterTl.to(
          info[i],
          { yPercent: 0, opacity: 1, ease: "none", duration: 0.4 },
          pos + 0.6,
        );
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

          const targetScroll =
            st.start + (to / (total - 1)) * (st.end - st.start);
          const lenis = getLenis();

          if (lenis) {
            lenis.scrollTo(targetScroll, { duration: 0.45 });
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
