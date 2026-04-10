"use client";

import styles from "./badge.module.css";
import { motion } from "motion/react";
import Image from "next/image";

export default function Badge({ text }: { text: string }) {
  return (
    <div className={styles.badgeContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        className={styles.badge}
      >
        <p className={styles.text}>{text}</p>
      </motion.div>
      <Image
        priority
        src="/logos/logo-japon.png"
        width={100}
        height={50}
        className={styles.badgeLogo}
        alt="Follow us on Twitter"
      />
    </div>
  );
}
