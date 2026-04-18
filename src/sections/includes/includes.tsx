"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import styles from "./includes.module.css";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";

type IncludeItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
};

const INCLUDE_ITEMS: IncludeItem[] = [
  {
    id: "stays",
    label: "I",
    title: "Estancias con carácter",
    description:
      "Espacios cuidadosamente seleccionados por ubicación, servicio y la experiencia que aportan al viaje.",
    image: "/images/hotel-jp.webp",
  },
  {
    id: "transport",
    label: "II",
    title: "Traslados mejor coordinados",
    description:
      "Shinkansen, traslados privados y tiempos pensados para que el viaje fluya con más orden y comodidad.",
    image: "/images/tren-jp.webp",
  },
  {
    id: "culture",
    label: "III",
    title: "Experiencias culturales curadas",
    description:
      "Templos, barrios históricos y actividades elegidas para conectar con el Japón más auténtico.",
    image: "/images/kyoto.webp",
  },
  {
    id: "gastronomy",
    label: "IV",
    title: "Escenas gastronómicas seleccionadas",
    description:
      "Reservas y momentos en la mesa pensados para descubrir Japón con más detalle y autenticidad.",
    image: "/images/buffet-jp.webp",
  },
  {
    id: "support",
    label: "V",
    title: "Acompañamiento en cada etapa",
    description:
      "Atención en español antes y durante el viaje para acompañarle con claridad y resolver cada detalle.",
    image: "/images/turismo-2.webp",
  },
];

// Ajuste de ritmo horizontal (solo codigo, no UI):
// - horizontalFactor: mayor valor = cards avanzan mas lento
const INCLUDES_SCROLL_TUNING = {
  horizontalFactor: 0.2,
} as const;

export default function Includes() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const pinLayer = pinRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const progressFill = progressRef.current;

      if (!section || !pinLayer || !viewport || !track || !progressFill) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(max-width: 768px)", () => {
        // Mobile: sin pin ni desplazamiento horizontal.
        gsap.set(track, { clearProps: "transform" });
        gsap.set(progressFill, { clearProps: "transform" });
      });

      mm.add("(min-width: 769px)", () => {
        gsap.set(progressFill, { scaleX: 0, transformOrigin: "left center" });

        // Debe calcularse con el ancho visible del carrusel (viewport),
        // no con pinLayer, para que la ultima card llegue completa.
        const getShift = () =>
          Math.max(track.scrollWidth - viewport.clientWidth, 0);
        const getEndDistance = () =>
          getShift() * INCLUDES_SCROLL_TUNING.horizontalFactor;

        // Timeline de una sola fase: solo desplazamiento horizontal.
        // Se elimina la pausa final para liberar el pin en cuanto termina.
        const tl = gsap.timeline();
        tl.to(track, { x: () => -getShift(), ease: "none", duration: 1 }, 0);
        tl.to(progressFill, { scaleX: 1, ease: "none", duration: 1 }, 0);

        const st = ScrollTrigger.create({
          animation: tl,
          trigger: section,
          start: "top top",
          end: () => `+=${getEndDistance()}`,
          pin: section,
          pinSpacing: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        return () => {
          st.kill();
          tl.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.includes}>
      <div ref={pinRef} className={styles.pinLayer}>
        <Badge text="LO ESCENCIAL" align="center" />

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <BlurredStagger
              text="Lo que da forma a tu experiencia premium"
              className={styles.title}
              highlights={[
                {
                  word: "premium",
                  useGradient: true,
                  gradientColors: ["#BF953F", "#FCF6BA", "#B38728"],
                },
                {
                  word: "forma",
                  useGradient: true,
                  gradientColors: ["#BF953F", "#FCF6BA", "#B38728"],
                },

                {
                  word: "da",
                  useGradient: true,
                  gradientColors: ["#BF953F", "#FCF6BA", "#B38728"],
                },
              ]}
            />
          </div>

          <Button
            variant="primary"
            className={styles.headerButton}
            type="button"
          >
            Solicita tu propuesta
          </Button>
        </header>

        <div ref={viewportRef} className={styles.viewport}>
          <div ref={trackRef} className={styles.track}>
            {INCLUDE_ITEMS.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.cardMedia}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 84vw, (max-width: 1024px) 52vw, 33vw"
                    className={styles.cardImage}
                  />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardIndex}>{item.label}</span>
                    <span className={styles.cardChip}>Integramos</span>
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.progressWrap} aria-hidden="true">
          <span className={styles.progressTrack}>
            <span ref={progressRef} className={styles.progressFill} />
          </span>
        </div>
      </div>
    </section>
  );
}
