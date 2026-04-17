"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import styles from "./interlude.module.css";

const wrap = (min: number, max: number, value: number) => {
  const rangeSize = max - min;
  return ((((value - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

type ParallaxRowProps = {
  text: string;
  baseVelocity: number;
};

function ParallaxRow({ text, baseVelocity }: ParallaxRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (value) => `${wrap(-55, -15, value)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();

    if (factor < 0) directionFactor.current = -1;
    if (factor > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={styles.row}>
      <motion.div style={{ x }} className={styles.track}>
        <span className={styles.chunk}>{text}</span>
        <span className={styles.chunk}>{text}</span>
        <span className={styles.chunk}>{text}</span>
        <span className={styles.chunk}>{text}</span>
      </motion.div>
    </div>
  );
}

export default function InterludeSection() {
  return (
    <section className={styles.interlude}>
      <div className={styles.textLayer} aria-hidden="true">
        <ParallaxRow text="japon premium experience" baseVelocity={-5} />
        <ParallaxRow text="curaduria atencion precision" baseVelocity={5} />
        <ParallaxRow text="momentos que si importan" baseVelocity={-3} />
      </div>

      <article className={styles.card}>
        <div className={styles.photoWrap}>
          <Image
            src="/images/geisha-perfil.webp"
            alt="Asesora de viaje Japon Premium"
            fill
            className={styles.photo}
            sizes="(max-width: 768px) 90px, 120px"
          />
        </div>

        <div className={styles.copy}>
          <p className={styles.role}>Luxury Travel Advisor</p>
          <h3 className={styles.title}>Aiko Nakamura</h3>
          <p className={styles.subtitle}>Especialista en experiencias privadas en Japon</p>
        </div>
      </article>
    </section>
  );
}
