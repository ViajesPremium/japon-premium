"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";
import styles from "./reveal-next-section.module.css";

gsap.registerPlugin(ScrollTrigger);

type RevealNextSectionProps = {
  top: ReactNode;
  bottom: ReactNode;
  overlapVh?: number;
  scrollTriggerId?: string;
  startAfterTriggerId?: string;
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
};

export default function RevealNextSection({
  top,
  bottom,
  overlapVh = 0,
  scrollTriggerId,
  startAfterTriggerId,
  className,
  topClassName,
  bottomClassName,
}: RevealNextSectionProps) {
  const pairRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const topLayer = topRef.current;
      const bottomLayer = bottomRef.current;
      if (!topLayer || !bottomLayer) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.set(topLayer, {
        transformOrigin: "50% 50%",
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        scale: 1,
        y: 0,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: scrollTriggerId,
          trigger: bottomLayer,
          start: () => {
            if (!startAfterTriggerId) return "top bottom";
            const parentTrigger = ScrollTrigger.getById(startAfterTriggerId);
            if (!parentTrigger) return "top bottom";
            return parentTrigger.end;
          },
          end: () => {
            if (!startAfterTriggerId) return "top top";
            const parentTrigger = ScrollTrigger.getById(startAfterTriggerId);
            if (!parentTrigger) return "top top";
            return parentTrigger.end + window.innerHeight;
          },
          pin: topLayer,
          pinSpacing: false,
          scrub: 0.9,
          anticipatePin: 1,
          refreshPriority: 20,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        topLayer,
        {
          scale: 1.08,
          y: -28,
          clipPath: "inset(0% 0% 100% 0% round 0px)",
          ease: "none",
        },
        0,
      );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: pairRef },
  );

  return (
    <div
      ref={pairRef}
      className={cn(styles.pair, className)}
      style={
        {
          "--reveal-overlap": `${overlapVh}vh`,
        } as CSSProperties
      }
    >
      <div ref={topRef} className={cn(styles.top, topClassName)}>
        {top}
      </div>
      <div ref={bottomRef} className={cn(styles.bottom, bottomClassName)}>
        {bottom}
      </div>
    </div>
  );
}
