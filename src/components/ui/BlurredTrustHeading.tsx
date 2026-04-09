"use client";

import { motion } from "motion/react";

export const BlurredTrustHeading = ({ styles }: { styles: any }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
      },
    },
  };

  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  // Dividimos el texto en las partes lógicas
  const textStart = "Más de 19 años creando experiencias ";
  const textHighlight = "premium";
  const textEnd = ".";

  return (
    <motion.h2
      variants={container}
      initial="hidden"
      animate="show"
      className={styles.trustStrip} // Mantiene el CSS general de tu h2
    >
      {/* 1. Anima el texto inicial */}
      {textStart.split("").map((char, index) => (
        <motion.span
          key={`start-${index}`}
          variants={letterAnimation}
          transition={{ duration: 0.3 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}

      {/* 2. El span con la máscara de imagen ENVUELVE a las letras animadas */}
      <span className={styles.trustSpan}>
        {textHighlight.split("").map((char, index) => (
          <motion.span
            key={`high-${index}`}
            variants={letterAnimation}
            transition={{ duration: 0.3 }}
          >
            {char}
          </motion.span>
        ))}
      </span>

      {/* 3. Anima el punto final */}
      {textEnd.split("").map((char, index) => (
        <motion.span
          key={`end-${index}`}
          variants={letterAnimation}
          transition={{ duration: 0.3 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
};
