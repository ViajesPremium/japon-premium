"use client";

import { cn } from "@/lib/utils";
import { useState, createContext, useContext, useEffect } from "react";
import {
  motion,
  MotionValue,
  SpringOptions,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

const ImageComparisonContext = createContext<
  | {
      sliderPosition: number;
      setSliderPosition: (pos: number) => void;
      motionSliderPosition: MotionValue<number>;
      motionSmoothY: MotionValue<number>;
    }
  | undefined
>(undefined);

export type ImageComparisonProps = {
  children: React.ReactNode;
  className?: string;
  enableHover?: boolean;
  springOptions?: SpringOptions;
};

const DEFAULT_SPRING_OPTIONS = {
  bounce: 0,
  duration: 0,
};

function ImageComparison({
  children,
  className,
  enableHover,
  springOptions,
}: ImageComparisonProps) {
  const [isDragging, setIsDragging] = useState(false);

  const motionValue = useMotionValue(50);
  const motionMouseY = useMotionValue(50);

  const motionSliderPosition = useSpring(
    motionValue,
    springOptions ?? DEFAULT_SPRING_OPTIONS,
  );
  const motionSmoothY = useSpring(
    motionMouseY,
    springOptions ?? DEFAULT_SPRING_OPTIONS,
  );

  const [sliderPosition, setSliderPosition] = useState(50);

  const handleDrag = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging && !enableHover) return;

    const containerRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();

    const x =
      "touches" in event
        ? event.touches[0].clientX - containerRect.left
        : (event as React.MouseEvent).clientX - containerRect.left;

    const y =
      "touches" in event
        ? event.touches[0].clientY - containerRect.top
        : (event as React.MouseEvent).clientY - containerRect.top;

    const percentageX = Math.min(
      Math.max((x / containerRect.width) * 100, 0),
      100,
    );
    const percentageY = Math.min(
      Math.max((y / containerRect.height) * 100, 0),
      100,
    );

    motionValue.set(percentageX);
    motionMouseY.set(percentageY);
    setSliderPosition(percentageX);
  };

  return (
    <ImageComparisonContext.Provider
      value={{
        sliderPosition,
        setSliderPosition,
        motionSliderPosition,
        motionSmoothY,
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden select-none",
          enableHover && "cursor-ew-resize",
          className,
        )}
        onMouseMove={handleDrag}
        onMouseDown={() => !enableHover && setIsDragging(true)}
        onMouseUp={() => !enableHover && setIsDragging(false)}
        onMouseLeave={() => !enableHover && setIsDragging(false)}
        onTouchMove={handleDrag}
        onTouchStart={() => !enableHover && setIsDragging(true)}
        onTouchEnd={() => !enableHover && setIsDragging(false)}
      >
        {children}
      </div>
    </ImageComparisonContext.Provider>
  );
}



const ImageComparisonImage = ({
  className,
  alt,
  src,
  position,
  children,
}: {
  className?: string;
  alt: string;
  src: string;
  position: "left" | "right";
  children?: React.ReactNode;
}) => {
  const { motionSliderPosition, motionSmoothY } = useContext(
    ImageComparisonContext,
  )!;

  const leftClipPath = useTransform(
    motionSliderPosition,
    (value) => `inset(0 0 0 ${value}%)`,
  );
  const rightClipPath = useTransform(
    motionSliderPosition,
    (value) => `inset(0 ${100 - value}% 0 0)`,
  );

  // Efecto STAGE_PARALLAX Ligero basado en ratón:
  const xParallax = useTransform(motionSliderPosition, [0, 100], ["-2%", "2%"]);
  const yParallax = useTransform(motionSmoothY, [0, 100], ["-2%", "2%"]);

  return (
    <motion.div
      className={cn("absolute inset-0 h-full w-full", className)}
      style={{
        clipPath: position === "left" ? leftClipPath : rightClipPath,
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          x: xParallax,
          y: yParallax,
          scale: 1.05,
        }}
      />
      {children}
    </motion.div>
  );
};

const ImageComparisonSlider = ({
  className,
  children,
}: {
  className: string;
  children?: React.ReactNode;
}) => {
  const { motionSliderPosition } = useContext(ImageComparisonContext)!;

  const left = useTransform(motionSliderPosition, (value) => `${value}%`);

  return (
    <motion.div
      className={cn("absolute top-0 bottom-0 w-1 cursor-ew-resize", className)}
      style={{
        left,
      }}
    >
      {children}
    </motion.div>
  );
};

export { ImageComparison, ImageComparisonImage, ImageComparisonSlider };
