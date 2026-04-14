"use client"

import React, { useId } from "react"
import { motion } from "motion/react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import Image from "next/image"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./carrousel.css"

export type CarouselImage = {
  src: string
  alt: string
}

export interface CarrouselProps {
  images?: CarouselImage[]
  className?: string
  showPagination?: boolean
  showNavigation?: boolean
  loop?: boolean
  autoplay?: boolean
  spaceBetween?: number
}

const DEFAULT_IMAGES: CarouselImage[] = [
  { src: "/images/gallery-7.webp", alt: "Templo tradicional en Japon" },
  { src: "/images/gallery-2.webp", alt: "Paisaje urbano de Japon" },
  { src: "/images/gallery-3.webp", alt: "Paisaje natural de Japon" },
  { src: "/images/gallery-4.webp", alt: "Geisha" },
  { src: "/images/gallery-5.webp", alt: "Casco de samurai" },
  { src: "/images/gallery-6.webp", alt: "Casco de samurai" },
]

const Carrousel = ({
  images = DEFAULT_IMAGES,
  className = "",
  showPagination = false,
  showNavigation = true,
  loop = true,
  autoplay = true,
  spaceBetween = 12,
}: CarrouselProps) => {
  const id = useId().replace(/[:]/g, "")
  const nextClass = `carrousel__next-${id}`
  const prevClass = `carrousel__prev-${id}`
  const paginationClass = `carrousel__pagination-${id}`

  return (
    <section className={`carrousel ${className}`.trim()} aria-label="Galeria">
      <motion.div
        className="carrousel__inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Swiper
          modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
          className="carrousel__swiper"
          spaceBetween={spaceBetween}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          loop={loop && images.length > 1}
          autoplay={
            autoplay
              ? {
                delay: 2200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
              : false
          }
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: true,
          }}
          navigation={
            showNavigation
              ? {
                nextEl: `.${nextClass}`,
                prevEl: `.${prevClass}`,
              }
              : false
          }
          pagination={
            showPagination
              ? {
                el: `.${paginationClass}`,
                clickable: true,
              }
              : false
          }
        >
          {images.map((image) => (
            <SwiperSlide key={`${image.src}-${image.alt}`} className="carrousel__slide">
              <Image
                className="carrousel__image"
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 62vw, 30vw"
              />
            </SwiperSlide>
          ))}

          {showNavigation && (
            <>
              <button
                type="button"
                aria-label="Anterior"
                className={`carrousel__nav carrousel__nav--prev ${prevClass}`}
              >
                <ChevronLeftIcon size={22} />
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                className={`carrousel__nav carrousel__nav--next ${nextClass}`}
              >
                <ChevronRightIcon size={22} />
              </button>
            </>
          )}

          {showPagination && <div className={`carrousel__pagination ${paginationClass}`} />}
        </Swiper>
      </motion.div>
    </section>
  )
}

export default Carrousel
