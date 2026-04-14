"use client";

import Image from "next/image";
import { motion } from "motion/react";
import styles from "./footer.module.css";

const samuraiMain = "/images/samurai4.webp";
const footerBrandLogo = "/logos/japon-grande-logo.png";

export default function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.topCap} />

      <div className={styles.mainContent}>
        <div className={styles.textContainer} aria-hidden="true">
          <div className={styles.brandLogoWrap}>
            <Image
              src={footerBrandLogo}
              alt="Viaja a Japon Premium"
              fill
              sizes="(max-width: 768px) 86vw, 60vw"
              loading="lazy"
              className={styles.brandLogo}
            />
          </div>
        </div>

        <div className={styles.samuraiContainer}>
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className={styles.samuraiImg}
          >
            <Image
              src={samuraiMain}
              alt="Samurai Central"
              fill
              sizes="(max-width: 768px) 80vw, 40vw"
              loading="lazy"
            />
          </motion.div>
        </div>

        <div className={styles.sideNavWrapper}>
          <div className={`${styles.navBlock} ${styles.alignLeft}`}>
            <span className={styles.navLabel}>PÁGINAS</span>
            <nav className={styles.navList}>
              <a href="#">INICIO</a>
              <a href="#">DESTINOS</a>
              <a href="#">EXPERIENCIAS</a>
              <a href="#">CALENDARIO</a>
            </nav>
          </div>

          <div className={`${styles.navBlock} ${styles.alignRight}`}>
            <span className={styles.navLabel}>SÍGUENOS</span>
            <nav className={styles.navList}>
              <a href="#">TIKTOK</a>
              <a href="#">INSTAGRAM</a>
              <a href="#">YOUTUBE</a>
              <a href="#">CONTACTO</a>
            </nav>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.copyText}>
            <p>© 2026 Viaja a Japón Premium. Todos los derechos reservados.</p>
          </div>
          <div className={styles.legalLinks}>
            <a href="#">PRIVACIDAD</a>
            <a href="#">TÉRMINOS</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
