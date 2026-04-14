"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MorphingText } from "@/components/ui/liquid-text";
import styles from "./image-section.module.css";

const STRENGTH = 18;

export default function ImgSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 20 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });
  const imgX = useTransform(x, [-1, 1], [-STRENGTH, STRENGTH]);
  const imgY = useTransform(y, [-1, 1], [-STRENGTH, STRENGTH]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <motion.div
        className={styles.img}
        aria-hidden="true"
        style={{ x: imgX, y: imgY }}
      />

      <div className={styles.imgOverlay} aria-hidden="true" />

      <div className={styles.left}>
        <Badge text="Nuestra promesa" />

        <div className={styles.titles}>
          <h2 className={`${styles.titleJapon} ${styles.titleJaponGold}`}>
            Japón
          </h2>

          <MorphingText
            className={styles.titlePremium}
            texts={["Auténtico", "Premium", "Exclusivo"]}
          />
        </div>

        <div className={styles.ctas}>
          <Button variant="primary">Diseña tu viaje</Button>
          <Button variant="secondary">Ver destinos</Button>
        </div>
      </div>

      <div className={styles.right} />
    </section>
  );
}
