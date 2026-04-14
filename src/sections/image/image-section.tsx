"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import GradientText from "@/components/ui/GradientText";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import ImageTrail from "@/components/ImageTrail";
import styles from "./image-section.module.css";

const JAPAN_IMAGES = [
  "/images/gallery-1.webp",
  "/images/gallery-4.webp",
  "/images/gallery-3.webp",
  "/images/gallery-1.webp",
  "/images/gallery-3.webp",
  "/images/gallery-4.webp",
  "/images/gallery-3.webp",
  "/images/gallery-1.webp",
];

const STRENGTH = 18;

export default function ImgSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 20 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });
  const imgX = useTransform(x, [-1, 1], [-STRENGTH, STRENGTH]);
  const imgY = useTransform(y, [-1, 1], [-STRENGTH, STRENGTH]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image with parallax */}
      <motion.div className={styles.img} aria-hidden="true" />

      {/* Optional overlay */}
      <div className={styles.imgOverlay} aria-hidden="true" />

      {/* ImageTrail over full section */}
      <div className={styles.trailWrap}>
        <ImageTrail items={JAPAN_IMAGES} variant={3} />
      </div>

      {/* Left side content */}
      <div className={styles.left}>
        <Badge text="Nuestra promesa" />

        <div className={styles.titles}>
          <BlurredStagger text="Confort" className={styles.titleJapon} />
          <GradientText
            colors={["#BF953F", "#FCF6BA", "#B38728", "#FCF6BA"]}
            animationSpeed={6}
            direction="horizontal"
            className={styles.titlePremium}
          >
            <span>Premium</span>
          </GradientText>
        </div>

        <div className={styles.ctas}>
          <Button variant="primary">Disena tu viaje</Button>
          <Button variant="secondary">Ver destinos</Button>
        </div>
      </div>

      {/* Right side */}
      <div className={styles.right} />
    </section>
  );
}
