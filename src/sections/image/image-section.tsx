"use client";

import dynamic from "next/dynamic";
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "@/components/ui/image-comparison";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import TextPressure from "@/components/ui/TextPressure";
import GradientText from "@/components/ui/GradientText";
import { motion } from "motion/react";

import styles from "./image-section.module.css";
import GeishaImg from "../../../public/images/geisha-img.png";
import SamuraiImg from "../../../public/images/samurai-img.png";

const leftItems = [
  "19 años especializados en Japón",
  "Diseñamos viajes totalmente a medida",
  "Atención en español antes, durante y después",
  "Selección premium de hoteles, rutas y experiencias",
  "Acceso a un Japón más auténtico y exclusivo",
  "Todo resuelto, sin estrés ni improvisación",
];

const rightItems = [
  "Arquitectura de viajes diseñada para ti",
  "Vivirás Japón de la forma más auténtica y exclusiva",
  "Cada detalle perfectamente cuidado",
  "Una experiencia fluida, bella y sin complicaciones",
  "Acompañamiento completo en español",
  "Japón como pocos se atreven a contarlo",
];

function ImgSectionContent() {
  return (
    <ImageComparison
      className={`${styles.imgSection} touch-pan-y`}
      enableHover
    >
      {/* LADO IZQUIERDO: GEISHA */}
      <ImageComparisonImage
        src={GeishaImg.src}
        className={styles.grayscaleImage}
        alt="Geisha"
        position="left"
      >
        <div className="absolute inset-0 z-0 opacity-[0.06] overflow-hidden flex items-center justify-center pointer-events-none mix-blend-overlay">
          <TextPressure
            text="TRADICIÓN"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#FFFFFF"
            minFontSize={120}
          />
        </div>

        <div className={styles.leftGradientOverlay} />

        <div className={styles.leftContentWrapper}>
          <div className={styles.headlineWrapper}>
            <BlurredStagger
              text="¿Por qué elegirnos?"
              className={styles.headline}
            />
            <div className={styles.divider} />
          </div>

          <ul className={styles.listWrapper}>
            {leftItems.map((item, index) => (
              <motion.li
                key={index}
                className={styles.listItem}
                whileHover={{ x: 10, scale: 1.02, color: "#fff" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className={styles.listNumber}>
                  <GradientText
                    colors={[
                      "#f3f4f6",
                      "#9ca3af",
                      "#d1d5db",
                      "#4b5563",
                      "#f3f4f6",
                    ]}
                    animationSpeed={4}
                  >
                    {(index + 1).toString().padStart(2, "0")}
                  </GradientText>
                </div>
                <div className={styles.listText}>{item}</div>
              </motion.li>
            ))}
          </ul>
        </div>
      </ImageComparisonImage>

      {/* LADO DERECHO: SAMURAI */}
      <ImageComparisonImage src={SamuraiImg.src} alt="Samurai" position="right">
        <div className="absolute inset-0 z-0 opacity-[0.06] overflow-hidden flex items-center justify-center pointer-events-none mix-blend-overlay">
          <TextPressure
            text="VANGUARDIA"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#FFFFFF"
            minFontSize={120}
          />
        </div>

        <div className={styles.rightGradientOverlay} />

        <div className={styles.rightContentWrapper}>
          <div className={styles.headlineWrapperRight}>
            <BlurredStagger
              text="Compromiso Premium"
              className={styles.headline}
            />
            <div className={styles.divider} />
          </div>

          <ul className={styles.listWrapperRight}>
            {rightItems.map((item, index) => (
              <motion.li
                key={index}
                className={styles.listItemRight}
                whileHover={{ x: -10, scale: 1.02, color: "#fff" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className={styles.listTextRight}>{item}</div>
                <div className={styles.listNumberRight}>
                  <GradientText
                    colors={[
                      "#f3f4f6",
                      "#9ca3af",
                      "#d1d5db",
                      "#4b5563",
                      "#f3f4f6",
                    ]}
                    animationSpeed={4}
                  >
                    {(index + 1).toString().padStart(2, "0")}
                  </GradientText>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </ImageComparisonImage>

      <ImageComparisonSlider className={styles.sliderBar}>
        <div className={styles.sliderHandle}></div>
      </ImageComparisonSlider>
    </ImageComparison>
  );
}

// Exportamos el componente con SSR desactivado para evitar conflictos de hidratación
export default dynamic(() => Promise.resolve(ImgSectionContent), {
  ssr: false,
  loading: () => (
    <div className={styles.imgSection}>
      <div className={styles.grayscaleImage} style={{ position: "absolute", inset: 0 }}>
        <img 
          src={GeishaImg.src} 
          alt="Japón" 
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} 
        />
      </div>
    </div>
  ),
});
