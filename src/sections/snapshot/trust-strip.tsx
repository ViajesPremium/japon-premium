"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./trust-strip.module.css";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import BentoGrid from "./BentoGrid";
import Badge from "@/components/ui/badge";

export default function Snapshot() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.snapshot}>
      <div className={styles.postersWrapper}></div>
      <div className={styles.snapshotContent}>
        <Badge text="Nueva seccion" variant="dark" align="center" />
        <BlurredStagger
          text="Más de 21 años diseñando experiencias premium."
          className={styles.trustStrip}
          highlights={[
            {
              word: "21",
              useGradient: true,
            },
            {
              word: "años",
              useGradient: true,
            },
            {
              word: "premium",
              useGradient: true,
            },
          ]}
        />
        <BentoGrid />
      </div>
    </section>
  );
}
