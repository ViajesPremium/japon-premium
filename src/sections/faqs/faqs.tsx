"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import styles from "./faqs.module.css";
import accordionStyles from "@/components/ui/accordion.module.css";
import Badge from "@/components/ui/badge";
import GradientText from "@/components/ui/GradientText";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";

const FAQS = [
  {
    id: "1",
    question: "¿Qué incluye un viaje organizado por Japón Premium?",
    answer:
      "Cada itinerario incluye vuelos internacionales, hospedaje en ryokanes y hoteles boutique cuidadosamente seleccionados, traslados privados, guía especializado en cultura japonesa, y acceso a experiencias exclusivas como cenas omakase, ceremonias de té privadas y visitas a templos en horario cerrado al público.",
  },
  {
    id: "2",
    question: "¿Con cuánta anticipación debo reservar mi viaje?",
    answer:
      "Recomendamos reservar con al menos 3 meses de anticipación para garantizar disponibilidad en los mejores ryokanes y restaurantes. Para viajes durante la temporada de flor de cerezo (marzo-abril) o momiji (noviembre), sugerimos reservar con 6 meses de antelación.",
  },
  {
    id: "3",
    question: "¿Los viajes están disponibles en grupo o solo de forma privada?",
    answer:
      "Todos nuestros viajes son de carácter privado. No compartirás itinerario con otros viajeros. Esto nos permite personalizar cada día según tu ritmo, intereses y preferencias gastronómicas, culturales o de descanso.",
  },
  {
    id: "4",
    question: "¿Necesito saber japonés para viajar con ustedes?",
    answer:
      "No. Tu guía acompañante habla español y japonés de forma fluida, y se encarga de toda la comunicación durante el viaje. Además, preparamos una guía de viaje personalizada con frases básicas, mapas y recomendaciones para que te sientas completamente cómodo.",
  },
  {
    id: "5",
    question: "¿Qué pasa si necesito cambiar o cancelar mi reservación?",
    answer:
      "Ofrecemos políticas flexibles dependiendo del tiempo de anticipación. Cambios de fecha sin costo hasta 60 días antes del viaje. Para cancelaciones, devolvemos el 80% del depósito si se realizan con más de 90 días de anticipación. Consulta nuestros términos completos al momento de contratar.",
  },
  {
    id: "6",
    question: "¿Puedo viajar con necesidades alimentarias especiales?",
    answer:
      "Por supuesto. Japón tiene una gastronomía vastísima y es posible adaptar cada comida a dietas vegetarianas, veganas, sin gluten o con alergias específicas. Solo indícanos tus necesidades al reservar y coordinamos con todos los restaurantes con anticipación.",
  },
  {
    id: "7",
    question: "¿En qué temporada es mejor visitar Japón?",
    answer:
      "Japón es un destino extraordinario durante todo el año. La primavera (marzo-mayo) ofrece el icónico sakura; el otoño (octubre-noviembre) regala los colores del momiji. El verano es vibrante con festivales, y el invierno perfecto para onsen y paisajes nevados. Te ayudamos a elegir la época ideal según lo que quieres vivir.",
  },
];

export default function Faqs() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string>(() => FAQS[0]?.id ?? "");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const clamp = (value: number, min = 0, max = 1) =>
      Math.min(max, Math.max(min, value));

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInCubic = (t: number) => t * t * t;

    // Curva de movimiento:
    // - Entrada visible: desde que el top toca casi el borde inferior
    //   hasta que sube hacia la zona media del viewport.
    // - Hold largo en pantalla.
    // - Salida tardia solo casi al final.
    const ENTRY_START_TOP_VH = 0.7;
    const ENTRY_END_TOP_VH = 0.3;
    const EXIT_START_BOTTOM_VH = 0.86;

    let rafId: number | null = null;

    const updateMotionProgress = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const entryStartTop = viewportHeight * ENTRY_START_TOP_VH;
      const entryEndTop = viewportHeight * ENTRY_END_TOP_VH;
      const entryRange = Math.max(entryStartTop - entryEndTop, 1);

      // Entrada perceptible en un tramo mas largo del viewport.
      const entryRaw = clamp((entryStartTop - rect.top) / entryRange);
      const entryProgress = easeOutCubic(entryRaw);

      // Salida tardia: solo cuando el bottom ya va muy abajo en viewport.
      const exitRaw = clamp(
        (viewportHeight * EXIT_START_BOTTOM_VH - rect.bottom) /
          (viewportHeight * EXIT_START_BOTTOM_VH),
      );
      const exitProgress = easeInCubic(exitRaw);

      const motionProgress = clamp(entryProgress * (1 - exitProgress));

      section.style.setProperty(
        "--faq-motion-progress",
        motionProgress.toFixed(4),
      );
    };

    const requestUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateMotionProgress();
      });
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const handleFaqOpen = (faqId: string) => {
    if (faqId === openFaqId) return;
    setOpenFaqId(faqId);
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Lateral izquierdo — samurai de perfil */}
      <div className={styles.sideLeft}>
        <div className={styles.sideImgFadeLeft} />
      </div>

      {/* ── Contenido central ── */}
      <div className={styles.center}>
        {/* Encabezado */}
        <div className={styles.header}>
          <Badge text="Preguntas frecuentes" variant="dark" align="center" />

          <GradientText
            colors={["#BF953F", "#FCF6BA", "#B38728", "#FCF6BA"]}
            animationSpeed={6}
            direction="horizontal"
            className={styles.titleGradient}
          >
            <h2 className={styles.title}>Todo lo que necesitas saber</h2>
          </GradientText>

          <BlurredStagger
            text="Resolvemos las dudas más comunes sobre nuestros viajes a Japón. Si no encuentras lo que buscas, escríbenos directamente."
            className={styles.subtitle}
          />

          <div className={styles.contactHint}>
            <p className={styles.contactLabel}>¿Otra pregunta?</p>
            <a
              href="mailto:hola@japonpremium.com"
              className={styles.contactLink}
            >
              hola@japonpremium.com
            </a>
          </div>
        </div>

        {/* Acordeón */}
        <div className={styles.accordionWrap}>
          <div role="list" aria-label="Preguntas frecuentes">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const triggerId = `faq-trigger-${faq.id}`;
              const contentId = `faq-content-${faq.id}`;

              return (
                <div
                  key={faq.id}
                  className={accordionStyles.item}
                  role="listitem"
                >
                  <h3 className={accordionStyles.header}>
                    <button
                      id={triggerId}
                      type="button"
                      className={accordionStyles.trigger}
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                      onClick={() => handleFaqOpen(faq.id)}
                    >
                      {faq.question}
                      <motion.span
                        className={accordionStyles.chevron}
                        animate={{
                          rotate: isOpen ? 180 : 0,
                          opacity: isOpen ? 0.9 : 0.5,
                        }}
                        transition={{
                          duration: 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        aria-hidden="true"
                      >
                        <ChevronDownIcon width={16} height={16} />
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={contentId}
                        role="region"
                        aria-labelledby={triggerId}
                        className={accordionStyles.content}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.22, ease: "easeOut" },
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className={accordionStyles.contentInner}>
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lateral derecho — geisha de perfil */}
      <div className={styles.sideRight}>
        <div className={styles.sideImgFade} />
      </div>
    </section>
  );
}
