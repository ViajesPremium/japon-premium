"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { cn } from "@/lib/utils";
import styles from "./skiper54.module.css";
import "swiper/css";

type SkiperImage = {
  src: string;
  alt: string;
  title: string;
};

interface Skiper54Props {
  images: SkiperImage[];
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
}

export function Skiper54({
  images,
  className,
  autoplay = false,
  loop = true,
  showNavigation = true,
  showPagination = true,
}: Skiper54Props) {
  const [current, setCurrent] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const isLoopEnabled = loop && images.length > 1;

  const autoplayConfig = useMemo(
    () =>
      autoplay
        ? {
            delay: 2000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }
        : false,
    [autoplay],
  );

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.carousel}>
        <Swiper
          modules={[Autoplay]}
          className={styles.track}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setCurrent(swiper.realIndex);
            // Posicionamiento inicial consistente para loop y no-loop.
            requestAnimationFrame(() => {
              swiper.update();
              if (isLoopEnabled) {
                swiper.slideToLoop(0, 0, false);
              } else {
                swiper.slideTo(0, 0, false);
              }
            });
          }}
          onSlideChange={(swiper) => setCurrent(swiper.realIndex)}
          loop={isLoopEnabled}
          rewind={false}
          loopAdditionalSlides={isLoopEnabled ? images.length : 0}
          centeredSlides
          observer
          observeParents
          slidesPerView={1.35}
          spaceBetween={12}
          autoplay={autoplayConfig}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 14 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 3.7, spaceBetween: 18 },
            1280: { slidesPerView: 4.2, spaceBetween: 20 },
          }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={`${img.src}-${img.title}-${index}`}>
              <div className={styles.slide}>
                <motion.div
                  initial={false}
                  animate={{
                    clipPath:
                      current !== index
                        ? "inset(15% 0 15% 0 round 1.2rem)"
                        : "inset(0 0 0 0 round 1.2rem)",
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={styles.imageMask}
                >
                  <div className={styles.imageWrap}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 24vw"
                      className={styles.image}
                    />
                  </div>
                </motion.div>

                <AnimatePresence mode="wait">
                  {current === index && (
                    <motion.p
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(10px)" }}
                      transition={{ duration: 0.4 }}
                      className={styles.title}
                    >
                      {img.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {showNavigation && (
          <div className={styles.nav}>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
              className={styles.navButton}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
              className={styles.navButton}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {showPagination && (
        <div className={styles.dots}>
          <div className={styles.dotsInner}>
            {Array.from({ length: images.length }).map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => {
                  const swiper = swiperRef.current;
                  if (!swiper) return;
                  if (isLoopEnabled) {
                    swiper.slideToLoop(index);
                  } else {
                    swiper.slideTo(index);
                  }
                }}
                className={cn(
                  styles.dot,
                  current === index && styles.dotActive,
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Skiper54;
