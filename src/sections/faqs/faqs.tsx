"use client";

import styles from "./faqs.module.css";
import Badge from "@/components/ui/badge";
import GradientText from "@/components/ui/GradientText";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  return (
    <section className={styles.section}>

      {/* Lateral izquierdo — samurai de perfil */}
      <div className={styles.sideLeft}>
        <div className={styles.sideImgFadeLeft} />
      </div>

      {/* ── Contenido central ── */}
      <div className={styles.center}>

        {/* Encabezado */}
        <div className={styles.header}>
          <Badge text="Preguntas frecuentes" variant="dark" />

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
            <a href="mailto:hola@japonpremium.com" className={styles.contactLink}>
              hola@japonpremium.com
            </a>
          </div>
        </div>

        {/* Acordeón */}
        <div className={styles.accordionWrap}>
          <Accordion type="single" collapsible>
            {FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>

      {/* Lateral derecho — geisha de perfil */}
      <div className={styles.sideRight}>
        <div className={styles.sideImgFade} />
      </div>

    </section>
  );
}
