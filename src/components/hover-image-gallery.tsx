"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./hover-image-gallery.module.css";

interface HoverImageGalleryProps {
  images?: string[];
  className?: string;
}

const DEFAULT_IMAGES = [
  "/images/gallery-1.webp",
  "/images/gallery-2.webp",
  "/images/gallery-3.webp",
  "/images/gallery-4.webp",
  "/images/gallery-5.webp",
  "/images/gallery-6.webp",
  "/images/gallery-7.webp",
];

export function HoverImageGallery({
  images = DEFAULT_IMAGES,
  className = "",
}: HoverImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;

    // Update mouse position for tooltip
    setMousePosition({ x, y });

    // Calculate which image to show based on horizontal position
    const imageIndex = Math.floor((x / width) * images.length);
    const clampedIndex = Math.max(0, Math.min(images.length - 1, imageIndex));

    setCurrentImageIndex(clampedIndex);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      <div
        className={styles.frame}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main displayed image */}
        <Image
          src={images[currentImageIndex] ?? images[0]}
          alt={`Gallery image ${currentImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 34vw"
          loading="lazy"
          className={styles.image}
        />

        {/* Glassmorphic Tooltip with Both Chevrons */}
        {isHovering && (
          <div
            className={styles.tooltip}
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
            }}
          >
            <div className={styles.tooltipBubble}>
              <div className={styles.iconRow}>
                {/* Left Chevron */}
                <svg
                  className={styles.icon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>

                {/* Right Chevron */}
                <svg
                  className={styles.icon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
