"use client";

import React from "react";
import styles from "./footer.module.css";
import TextPressure from "@/components/ui/TextPressure";
import { motion } from "motion/react";

const samuraiMain = "/images/samurai3.webp";

export default function Footer() {
  const brutallFontUrl =
    "/fonts/nohemi-font-family/Nohemi-VF-BF6438cc58ad63d.ttf";

  return (
    <footer className={styles.footerWrapper}>
      {/* CORTE SUPERIOR */}
      <div className={styles.topCap} />

      {/* ÁREA DE CONTENIDO */}
      <div className={styles.mainContent}>
        {/* ESTRATO 1: Texto (Detrás del Samurai, ancho controlado) */}
        <div className={styles.textContainer}>
          <div className={styles.pressureWordSlot}>
            <TextPressure
              text="Japón"
              fontFamily="Nohemi"
              fontUrl="/fonts/nohemi-font-family/Nohemi-VF-BF6438cc58ad63d.ttf"
              fontWeight={100}
              fontStyle="normal"
              fontSize={190}
              flex={false}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              weightFrom={100}
              weightTo={400}
              scaleFrom={1}
              scaleTo={1}
              textColor="var(--white)"
              strokeColor="var(--white)"
              minFontSize={80}
            />
          </div>
          <div className={`${styles.pressureWordSlot} ${styles.secondLine}`}>
            <TextPressure
              text="Premium"
              fontFamily="Nohemi"
              fontUrl="/fonts/nohemi-font-family/Nohemi-VF-BF6438cc58ad63d.ttf"
              fontWeight={900}
              fontStyle="normal"
              fontSize={190}
              flex={false}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={false}
              weightFrom={600}
              weightTo={100}
              scaleFrom={1.09}
              scaleTo={1}
              textColor="var(--secondary)"
              strokeColor="var(--secondary)"
              minFontSize={80}
            />
          </div>
        </div>

        {/* ESTRATO 2: Samurai (En frente del texto, anclado abajo) */}
        <div className={styles.samuraiContainer}>
          <motion.img
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            src={samuraiMain}
            alt="Samurai Central"
            className={styles.samuraiImg}
          />
        </div>

        {/* ESTRATO 3: Navegación Lateral (Frente a todo) */}
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

        {/* BARRA INFERIOR */}
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
