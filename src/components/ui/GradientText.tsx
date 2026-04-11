"use client";

import { ReactNode } from "react";
import "./GradientText.css";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: "horizontal" | "vertical" | "diagonal";
  pauseOnHover?: boolean;
  yoyo?: boolean;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#BF953F", "#FCF6BA", "#B38728"],
  animationSpeed = 8,
  showBorder = false,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
}: GradientTextProps) {
  // 1. Configuramos el ángulo del degradado
  const gradientAngle =
    direction === "horizontal"
      ? "to right"
      : direction === "vertical"
        ? "to bottom"
        : "to bottom right";

  // 2. Calculamos el tamaño del fondo según la dirección
  const bgSize =
    direction === "horizontal"
      ? "300% 100%"
      : direction === "vertical"
        ? "100% 300%"
        : "300% 300%";

  // 3. Seleccionamos el keyframe de CSS correspondiente
  const animationName =
    direction === "vertical"
      ? "gradient-slide-vertical"
      : "gradient-slide-horizontal";

  // Duplicamos el primer color al final para un bucle fluido
  const gradientColors = [...colors, colors[0]].join(", ");

  // 4. Inyectamos la animación pura por CSS
  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: bgSize,
    animationName: animationName,
    animationDuration: `${animationSpeed}s`,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDirection: yoyo ? "alternate" : "normal",
  } as React.CSSProperties;

  return (
    <div
      className={`animated-gradient-text ${showBorder ? "with-border" : ""} ${
        pauseOnHover ? "pause-on-hover" : ""
      } ${className}`}
    >
      {showBorder && <div className="gradient-overlay" style={gradientStyle} />}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}
