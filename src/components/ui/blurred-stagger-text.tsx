"use client";

import { motion } from "motion/react";

export const BlurredStagger = ({
  text = "we love hextaui.com ❤️",
  className,
}: {
  text: string;
  className?: string;
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
      viewport={{ once: true, amount: 0.4 }}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", columnGap: "0.3em" }}
    >
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-flex" }}>
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
      ))}
    </motion.h2>
  );
};
