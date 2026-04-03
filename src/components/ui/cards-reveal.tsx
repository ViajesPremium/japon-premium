"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./cards-reveal.css";

const images = [
  "/images/hotel-jp.webp",
  "/images/tren-jp.webp",
  "/images/buffet-jp.webp",
  "/images/turismo-1.webp",
  "/images/turismo-2.webp",
  "/images/turismo-3.webp",
  "/images/turismo-4.jpg",
];

const Skiper34 = () => {
  return (
    <section className="cardsReveal">
      {images.map((img, idx) => (
        <StickyCard_003 key={idx} imgUrl={img} />
      ))}
    </section>
  );
};

const StickyCard_003 = ({ imgUrl }: { imgUrl: string }) => {
  const vertMargin = 10;
  const container = useRef(null);
  const [maxScrollY, setMaxScrollY] = useState(Infinity);

  const filter = useMotionValue(0);
  // Remove filter2, add negateFilter
  const negateFilter = useTransform(filter, (value) => -value);

  const { scrollY } = useScroll({
    target: container,
  });
  const scale = useTransform(scrollY, [maxScrollY, maxScrollY + 10000], [1, 0]);
  const isInView = useInView(container, {
    margin: `0px 0px -${100 - vertMargin}% 0px`,
    once: true,
  });

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latestScrollY) => {
      let animationValue = 1;
      if (latestScrollY > maxScrollY) {
        animationValue = Math.max(0, 1 - (latestScrollY - maxScrollY) / 10000);
      }

      scale.set(animationValue);
      filter.set((1 - animationValue) * 100);
    });

    return () => unsubscribe();
  }, [filter, maxScrollY, scale, scrollY]);

  useEffect(() => {
    if (isInView) {
      setMaxScrollY(scrollY.get());
    }
  }, [isInView, scrollY]);

  return (
    <motion.div
      ref={container}
      className="stickyCard"
      style={{
        scale: scale,
        rotate: filter,
        height: `${100 - 2 * vertMargin}vh`,
        top: `${vertMargin}vh`,
      }}
    >
      <motion.img
        src={imgUrl}
        alt={imgUrl}
        style={{
          rotate: negateFilter,
          scale: 1.25,
        }}
        className="stickyCard__image"
        sizes="90vw"
      />
    </motion.div>
  );
};

export { Skiper34, StickyCard_003 };
