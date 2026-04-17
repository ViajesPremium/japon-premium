"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type CSSProperties,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import type { GoogleRatingData } from "@/lib/google-reviews";
import { GOOGLE_RATING_FALLBACK } from "@/lib/google-reviews";
import Badge from "@/components/ui/badge";
import styles from "./testimonials.module.css";
import { Button } from "@/components/ui/button";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Una experiencia que redefinio completamente lo que significa viajar. Cada detalle, desde los ryokanes hasta los trenes bala, fue seleccionado con un gusto impecable.",
    name: "Ana Garcia",
    location: "Ciudad de Mexico",
    avatar: "https://i.pravatar.cc/600?img=47",
  },
  {
    id: 2,
    quote:
      "Viaje solo por primera vez y no podria haber elegido mejor compania. La atencion, la logistica y la curaduria de experiencias gastronomicas fue excepcional.",
    name: "Carlos Mendoza",
    location: "Guadalajara",
    avatar: "https://i.pravatar.cc/600?img=33",
  },
  {
    id: 3,
    quote:
      "Lo que mas me sorprendio fue la profundidad cultural del itinerario. No fue solo turismo, fue una inmersion real en el alma de Japon.",
    name: "Sofia Reyes",
    location: "Monterrey",
    avatar: "https://i.pravatar.cc/600?img=49",
  },
  {
    id: 4,
    quote:
      "El servicio fue tan discreto y preciso que simplemente flui por Japon sin preocupaciones. Los hoteles boutique, las cenas omakase, los jardines al amanecer.",
    name: "Miguel Angel Torres",
    location: "Ciudad de Mexico",
    avatar: "https://i.pravatar.cc/600?img=60",
  },
  {
    id: 5,
    quote:
      "Celebre mis 40 años en Kyoto gracias a Japon Premium. Organizaron una cena privada en un ryokan centenario que nunca olvidare.",
    name: "Valentina Cruz",
    location: "Puebla",
    avatar: "https://i.pravatar.cc/600?img=44",
  },
];

function GoogleBadge({ data }: { data: GoogleRatingData }) {
  const fullStars = Math.floor(data.rating);
  const hasHalf = data.rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={styles.googleBadge}>
      <svg
        className={styles.googleLogo}
        viewBox="0 0 24 24"
        aria-label="Google"
        role="img"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>

      <div className={styles.googleInfo}>
        <div
          className={styles.stars}
          aria-label={`${data.rating} de 5 estrellas`}
        >
          {Array.from({ length: fullStars }).map((_, i) => (
            <StarIcon key={`f-${i}`} type="full" />
          ))}
          {hasHalf && <StarIcon type="half" />}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <StarIcon key={`e-${i}`} type="empty" />
          ))}
          <span className={styles.ratingNum}>{data.rating.toFixed(1)}</span>
        </div>

        <p className={styles.googleLabel}>
          Basado en{" "}
          <span className={styles.googleCount}>
            {data.totalRatings.toLocaleString("es-MX")}
          </span>{" "}
          resenas de Google
        </p>
      </div>
    </div>
  );
}

function StarIcon({ type }: { type: "full" | "half" | "empty" }) {
  if (type === "full") {
    return (
      <svg className={styles.star} viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "half") {
    return (
      <svg className={styles.star} viewBox="0 0 20 20" aria-hidden="true">
        <defs>
          <linearGradient id="half-grad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          fill="url(#half-grad)"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`${styles.star} ${styles.starEmpty}`}
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

interface TestimonialsProps {
  googleRating?: GoogleRatingData;
}

const AUTOPLAY_DELAY = 8000;

type SakuraSettings = {
  petalCount: number;
  duration: number;
  drift: number;
  size: number;
  opacity: number;
  cutoff: number;
};

// Ajusta aqui los valores de la animacion (solo codigo, no UI visible)
const SAKURA_CONFIG: SakuraSettings = {
  petalCount: 20,
  duration: 21,
  drift: 24,
  size: 20,
  opacity: 1,
  cutoff: 1,
};

const seededNoise = (seed: number) => {
  let x = (seed ^ 0x9e3779b9) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x85ebca6b) >>> 0;
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};

const round = (value: number, precision = 3) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function Testimonials({ googleRating }: TestimonialsProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const [sectionHeight, setSectionHeight] = useState(0);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % TESTIMONIALS.length);
    }, AUTOPLAY_DELAY);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateHeight = () => {
      setSectionHeight(section.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const prev = () => {
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    resetTimer();
  };

  const next = () => {
    setCurrent((c) => (c + 1) % TESTIMONIALS.length);
    resetTimer();
  };

  const t = TESTIMONIALS[current];
  const pad = (n: number) => String(n).padStart(2, "0");
  const ratingData = googleRating ?? GOOGLE_RATING_FALLBACK;

  const petals = useMemo(() => {
    const safeHeight = sectionHeight > 0 ? sectionHeight : 900;

    return Array.from({ length: SAKURA_CONFIG.petalCount }, (_, index) => {
      const seed = index + 1;
      const xNoise = seededNoise(seed * 101 + 17);
      const durationNoise = seededNoise(seed * 137 + 29);
      const delayNoise = seededNoise(seed * 173 + 43);
      const driftNoise = seededNoise(seed * 197 + 59);
      const sizeNoise = seededNoise(seed * 227 + 71);
      const opacityNoise = seededNoise(seed * 251 + 89);
      const swayNoise = seededNoise(seed * 283 + 107);
      const rotationNoise = seededNoise(seed * 313 + 131);
      const blurNoise = seededNoise(seed * 347 + 151);
      const distanceNoise = seededNoise(seed * 379 + 167);

      const slot = (index + 0.5) / SAKURA_CONFIG.petalCount;
      const spread = 100 / SAKURA_CONFIG.petalCount;
      const jitter = (xNoise - 0.5) * spread * 0.9;
      const xStart = round(clamp(slot * 100 + jitter, 1, 99), 3);
      const duration = round(
        SAKURA_CONFIG.duration * (0.85 + durationNoise * 0.5),
        3,
      );
      const delay = round(-delayNoise * duration, 3);
      const drift = round(SAKURA_CONFIG.drift * (0.45 + driftNoise * 0.95), 3);
      const size = round(SAKURA_CONFIG.size * (0.7 + sizeNoise * 0.75), 3);
      const opacity = round(
        SAKURA_CONFIG.opacity * (0.75 + opacityNoise * 0.5),
        3,
      );
      const swayDuration = round(duration * (0.42 + swayNoise * 0.36), 3);
      const rotation = round(70 + rotationNoise * 220, 3);
      const blur = round(blurNoise * 0.9, 3);
      const distanceFactor = round(
        SAKURA_CONFIG.cutoff * (0.87 + distanceNoise * 0.12),
        4,
      );
      const travel = round(
        safeHeight * Math.min(distanceFactor, SAKURA_CONFIG.cutoff),
        3,
      );

      return {
        id: `petal-${seed}`,
        xStart,
        duration,
        delay,
        drift,
        size,
        opacity,
        swayDuration,
        rotation,
        blur,
        travel,
      };
    });
  }, [sectionHeight]);

  return (
    <section ref={sectionRef} className={styles.testimonials}>
      <div className={styles.sectionBadge}>
        <Badge text="Testimonios" variant="dark" align="center" />
      </div>

      <div className={styles.sakuraLayer} aria-hidden="true">
        {petals.map((petal) => (
          <span
            key={petal.id}
            className={styles.petalTrack}
            style={
              {
                "--petal-x": `${petal.xStart}%`,
                "--petal-duration": `${petal.duration}s`,
                "--petal-delay": `${petal.delay}s`,
                "--petal-travel": `${petal.travel}px`,
                "--petal-drift": `${petal.drift}px`,
                "--petal-size": `${petal.size}px`,
                "--petal-opacity": `${petal.opacity.toFixed(3)}`,
                "--petal-sway-duration": `${petal.swayDuration}s`,
                "--petal-rotation": `${petal.rotation}deg`,
                "--petal-blur": `${petal.blur}px`,
              } as CSSProperties
            }
          >
            <span className={styles.petal} />
          </span>
        ))}
      </div>

      <div className={styles.inner}>
        <div className={styles.photo}>
          <div className={styles.photoSquare}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                style={{ position: "absolute", inset: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Image
                  src={t.avatar}
                  alt={t.name}
                  fill
                  className={styles.photoImg}
                  sizes="(max-width: 768px) 90px, (max-width: 1024px) 32vw, 25vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.controlsBar}>
            <div className={styles.testimonialNumber}>
              <p className={styles.number}>
                {pad(current + 1)}/{pad(TESTIMONIALS.length)}
              </p>
            </div>

            <div className={styles.arrows}>
              <button
                className={styles.arrow}
                onClick={prev}
                aria-label="Anterior"
              >
                <ArrowLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                className={styles.arrow}
                onClick={next}
                aria-label="Siguiente"
              >
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.testimonial}>
              <svg
                className={styles.quoteMark}
                viewBox="0 0 27 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="quoteGold"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#BF953F" />
                    <stop offset="40%" stopColor="#FCF6BA" />
                    <stop offset="70%" stopColor="#B38728" />
                    <stop offset="100%" stopColor="#FCF6BA" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#quoteGold)"
                  d="M 27 20 H 15.286 V 11.2929 L 20.3288 0 H 24.9514 L 20.8541 10.4485 H 27 V 20 Z M 11.7665 20 H 0 V 11.2929 L 5.09533 0 H 9.7179 L 5.62062 10.4485 H 11.7665 V 20 Z"
                />
              </svg>

              <BlurredStagger
                key={current}
                text={t.quote}
                isActive={true}
                className={styles.text}
              />
            </div>

            <div className={styles.testimonialFooter}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`author-${current}`}
                  className={styles.author}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.location}>{t.location}</p>
                </motion.div>
              </AnimatePresence>

              <GoogleBadge data={ratingData} />
            </div>
          </div>

          <div className={styles.bottomRow}>
            <Button variant="primary">Planea tu viaje</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
