"use client";

import * as React from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import styles from "./FocusRail.module.css";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
  href?: string;
  meta?: string;
};

interface FocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const BASE_SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
} as const;

const TAP_SPRING = {
  type: "spring",
  stiffness: 450,
  damping: 18,
  mass: 1,
} as const;

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
}: FocusRailProps) {
  const count = items.length;
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const lastWheelTime = React.useRef<number>(0);

  if (count === 0) return null;

  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;

      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;

      if (Math.abs(delta) > 20) {
        if (delta > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        lastWheelTime.current = now;
      }
    },
    [handleNext, handlePrev],
  );

  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = window.setInterval(() => handleNext(), interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    },
    [handleNext, handlePrev],
  );

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  const onDragEnd = React.useCallback(
    (
      _event: MouseEvent | TouchEvent | PointerEvent,
      { offset, velocity }: PanInfo,
    ) => {
      const swipe = swipePower(offset.x, velocity.x);

      if (swipe < -swipeConfidenceThreshold) {
        handleNext();
      } else if (swipe > swipeConfidenceThreshold) {
        handlePrev();
      }
    },
    [handleNext, handlePrev],
  );

  const visibleIndices = [-2, -1, 0, 1, 2];

  return (
    <div
      className={`${styles.container} ${className || ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
    >
      {/* Background Section */}
      <div className={styles.bgContainer}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`bg-${activeItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0 }}
          >
            <img src={activeItem.imageSrc} alt="" className={styles.bgImage} />
            <div className={styles.bgOverlay} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.mainContent}>
        {/* Carousel Rail */}
        <motion.div
          className={styles.railWrapper}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {visibleIndices.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = items[index];

            if (!loop && (absIndex < 0 || absIndex >= count)) return null;

            const isCenter = offset === 0;
            const dist = Math.abs(offset);
            const xOffset = offset * 300;
            const zOffset = -dist * 10;
            const scale = isCenter ? 1 : 0.85;
            const rotateY = offset * -0;
            const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0);
            const blur = isCenter ? 0 : dist * 0.5;
            const brightness = isCenter ? 1 : 1;

            return (
              <motion.div
                key={absIndex}
                className={`${styles.card} ${
                  isCenter ? styles.cardCenter : styles.cardSide
                }`}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale,
                  rotateY,
                  opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                transition={{
                  ...BASE_SPRING,
                  scale: TAP_SPRING,
                }}
                onClick={() => {
                  if (offset !== 0) setActive((p) => p + offset);
                }}
              >
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className={styles.cardImage}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer Info & Controls */}
        <div className={styles.footer}>
          <div className={styles.textInfo}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <h2 className={styles.title}>{activeItem.title}</h2>
                {activeItem.description && (
                  <p className={styles.description}>{activeItem.description}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
