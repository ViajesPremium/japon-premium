"use client";

import { motion } from "motion/react";
import GradientText from "./GradientText";
import styles from "./blurred-stagger-text.module.css";

// Definimos el tipo para las palabras destacadas
type HighlightWord = {
  word: string;
  className?: string;
  useGradient?: boolean;
  gradientColors?: string[];
  gradientSpeed?: number;
};

export const BlurredStagger = ({
  text = "",
  className,
  highlights = [],
  style = {},
}: {
  text: string;
  className?: string;
  highlights?: HighlightWord[];
  style?: React.CSSProperties;
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.018,
      },
    },
  };

  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <motion.h2
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.4 }}
      className={className}
      style={{ ...style, display: "flex", flexWrap: "wrap", columnGap: "0.3em" }}
    >
      {text.split(" ").map((word, wordIndex) => {
        // Limpiamos la palabra de signos de puntuación solo para la comparación
        const cleanWord = word.replace(/[.,!?;:]/g, "");
        const highlighted = highlights.find((h) => h.word === cleanWord);

        // --- SOLUCIÓN PARA EL TEXTO CON GRADIENTE ---
        if (highlighted?.useGradient) {
          return (
            <motion.span
              key={wordIndex}
              // Aplicamos la animación a la palabra completa como si fuera una sola letra.
              // Esto evita el bug de CSS de los navegadores y mantiene intacto el gradiente.
              variants={letterAnimation}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{ display: "inline-flex" }}
            >
              <GradientText
                colors={highlighted.gradientColors}
                animationSpeed={highlighted.gradientSpeed}
                // Añadimos inline-flex para asegurarnos de que no rompa la línea actual
                className={styles.highlighted}
              >
                {word}
              </GradientText>
            </motion.span>
          );
        }

        // --- TEXTO NORMAL LETRA POR LETRA ---
        return (
          <span
            key={wordIndex}
            className={highlighted ? (highlighted.className ?? "") : ""}
            style={{ display: "inline-flex" }}
          >
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                variants={letterAnimation}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </motion.h2>
  );
};
