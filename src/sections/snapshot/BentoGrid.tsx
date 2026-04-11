"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import styles from "./trust-strip.module.css";

gsap.registerPlugin(ScrollTrigger);

const bentoCards = [
  { image: "/images/kioto-japon.webp", text: "Kyoto & Nara", wide: false },
  {
    image: "/images/comida-japon.webp",
    text: "Gastronomía auténtica",
    wide: false,
  },
  { image: "/images/hotel-japon.webp", text: "Hospedaje de lujo", wide: false },
];

export default function BentoGrid() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards.slice(0, 3),
        { y: 80, opacity: 0, scale: 0.93 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 88%",
            end: "bottom 5%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.bentoGrid}>
      {bentoCards.map((card, i) => (
        <div
          key={i}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className={`${styles.bentoCard} ${card.wide ? styles.bentoCardWide : ""}`}
          style={{ backgroundImage: `url(${card.image})` }}
        >
          <div className={styles.bentoCardOverlay} />
          <div className={styles.bentoCardContent}>
            <p className={styles.bentoCardText}>{card.text}</p>
            <Button variant="secondary">Descubrir</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
