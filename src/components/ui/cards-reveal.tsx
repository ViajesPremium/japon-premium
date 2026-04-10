"use client";

import { useEffect, useRef } from "react";
import "./cards-reveal.css";

const images = [
  "/images/lummi/img14.png",
  "/images/lummi/img30.png",
  "/images/lummi/img19.png",
  "/images/lummi/img21.png",
  "/images/lummi/img23.png",
  "/images/lummi/imgp2.png",
  "/images/lummi/img27.png",
];

const Skiper34 = () => (
  <section className="cardsRevealSection">
    <div className="hintWrap">
      <span className="hintText">scroll down to see effect</span>
    </div>
    {images.map((img, idx) => (
      <StickyCard_003
        key={idx}
        imgUrl={img}
        index={idx}
        isLast={idx === images.length - 1}
      />
    ))}
  </section>
);

const StickyCard_003 = ({
  imgUrl,
  index,
  isLast,
}: {
  imgUrl: string;
  index: number;
  isLast: boolean;
}) => {
  const vertMargin = 10;

  // Refs directos al DOM — sin pasar por React state ni Framer Motion
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Guardamos initialTop en un ref para que el scroll listener no necesite
  // volver a suscribirse cuando cambie el valor (evita el ciclo useEffect)
  const initialTopRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      // Posición absoluta en el documento en la que esta carta se vuelve sticky
      initialTopRef.current =
        window.scrollY + rect.top - (window.innerHeight * vertMargin) / 100;
    };

    // Medimos dos veces: rápido (100ms) y tardío (600ms) para cubrir
    // casos donde el layout tarda en asentarse (fuentes, imágenes, Lenis)
    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    // La última carta se queda arriba del stack — no necesita exit animation
    if (isLast) return;

    // cardSpacing: distancia de scroll entre que esta carta se vuelve sticky
    // y la siguiente lo hace. = height(80vh) + margin-bottom(40vh) = 120vh
    const cardSpacing = window.innerHeight * 1.2;
    const exitRange = 1200; // px de scroll para que la carta salga completamente

    const onScroll = () => {
      const y = window.scrollY;
      const top = initialTopRef.current;

      // Si aún no medimos la posición, no hacer nada
      if (top === 0) return;

      // El exit empieza cuando la siguiente carta ya llegó encima de esta
      const exitStart = top + cardSpacing;

      let v = 1;
      let rot = 0;

      if (y > exitStart) {
        v = Math.max(0, 1 - (y - exitStart) / exitRange);
        rot = (1 - v) * 10; // máximo 10° de rotación
      }

      // Mutación directa del DOM — sin pasar por React, sin re-renders
      if (cardRef.current) {
        cardRef.current.style.transform = `scale(${v}) rotate(${rot}deg)`;
      }
      if (imgRef.current) {
        // La imagen contra-rota para que no gire con la carta
        imgRef.current.style.transform = `scale(1.25) rotate(${-rot}deg)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLast]);

  return (
    // div normal, SIN motion.div — Framer Motion puede fijar will-change/transform
    // en el elemento sticky y romper su comportamiento en algunos navegadores
    <div
      ref={cardRef}
      className="stickyCard"
      style={{
        height: `${100 - 2 * vertMargin}vh`,
        top: `${vertMargin}vh`,
        zIndex: index + 10,
        transformOrigin: "center center",
      }}
    >
      <img
        ref={imgRef}
        src={imgUrl}
        alt=""
        className="cardImage"
        style={{
          transform: "scale(1.25)",
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};

export { Skiper34, StickyCard_003 };
