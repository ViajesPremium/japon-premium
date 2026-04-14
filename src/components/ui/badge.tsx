"use client";

import styles from "./badge.module.css";
import { motion } from "motion/react";
import Image from "next/image";

interface BadgeProps {
  text: string;
  variant?: "light" | "dark";
}

export default function Badge({ text, variant = "light" }: BadgeProps) {
  const badgeClass = [
    styles.badge,
    variant === "dark" ? styles.badgeDark : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={styles.badgeContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        className={badgeClass}
      >
        <p className={styles.text}>{text}</p>
      </motion.div>
      <Image
        priority
        src={variant === "dark" ? "/logos/HORIZONTAL NEGRO.svg" : "/logos/logo-japon.png"}
        width={100}
        height={50}
        className={styles.badgeLogo}
        alt="Japón Premium"
      />
    </div>
  );
}
