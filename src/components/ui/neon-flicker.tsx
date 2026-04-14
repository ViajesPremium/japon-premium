"use client";

import styles from "./neon-flicker.module.css";

interface NeonFlickerProps {
  text: string;
  color?: string;        // color del brillo, default blanco
  className?: string;
}

export default function NeonFlicker({
  text,
  color = "#ffffff",
  className,
}: NeonFlickerProps) {
  return (
    <span
      className={`${styles.neon} ${className ?? ""}`}
      style={{ "--neon-color": color } as React.CSSProperties}
    >
      {text}
    </span>
  );
}
