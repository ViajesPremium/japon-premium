"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import styles from "./ctaForm.module.css";

gsap.registerPlugin(ScrollTrigger);

const SHOJI_BASE = "/images/base-puertas.webp";
const SHOJI_LEFT = "/images/puerta-izquierda.webp";
const SHOJI_RIGHT = "/images/puerta-derecha.webp";

export default function CTAForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const shojiRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const roomGlowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const shoji = shojiRef.current;
      const base = baseRef.current;
      const leftDoor = leftDoorRef.current;
      const rightDoor = rightDoorRef.current;
      const form = formRef.current;
      const roomGlow = roomGlowRef.current;

      if (
        !section ||
        !shoji ||
        !base ||
        !leftDoor ||
        !rightDoor ||
        !form ||
        !roomGlow
      ) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
      const getOpenDistance = () => (isMobile() ? 10 : 18);
      const getExitDistance = () => (isMobile() ? 76 : 108);
      const getPinDistance = () =>
        window.innerHeight * (isMobile() ? 1.55 : 3.15);
      const getHoldDuration = () => (isMobile() ? 0.45 : 1.15);
      const getFinalScale = () => (isMobile() ? 1.34 : 1.55);
      const getFinalBlur = () => (isMobile() ? "5px" : "8px");
      const scrubStrength = isMobile() ? 0.55 : 1;

      if (prefersReducedMotion) {
        gsap.set(shoji, { autoAlpha: 0 });
        gsap.set(base, { autoAlpha: 0 });
        gsap.set([leftDoor, rightDoor], { autoAlpha: 0 });
        gsap.set(form, { autoAlpha: 1, scale: 1, y: 0 });
        gsap.set(roomGlow, { autoAlpha: 0.08, scale: 1 });
        return;
      }

      gsap.set(base, { autoAlpha: 1, filter: "blur(0px)", force3D: true });
      gsap.set(leftDoor, { xPercent: -2 });
      gsap.set(rightDoor, { xPercent: 2 });
      gsap.set([leftDoor, rightDoor], {
        autoAlpha: 1,
        filter: "blur(0px)",
        force3D: true,
      });
      gsap.set(shoji, {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(0px)",
        force3D: true,
      });
      gsap.set(form, { autoAlpha: 1, scale: 1, y: 0 });
      gsap.set(roomGlow, { autoAlpha: 0.26, scale: 0.9 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getPinDistance()}`,
          pin: true,
          pinSpacing: true,
          scrub: scrubStrength,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(leftDoor, { xPercent: () => -getOpenDistance(), duration: 1 }, 0)
        .to(rightDoor, { xPercent: () => getOpenDistance(), duration: 1 }, 0)
        .to(roomGlow, { autoAlpha: 0.55, scale: 1, duration: 0.4 }, 1.25)
        .to(
          leftDoor,
          {
            xPercent: () => -(getOpenDistance() + getExitDistance()),
            scale: 1.06,
            duration: 0.88,
          },
          1.5,
        )
        .to(
          rightDoor,
          {
            xPercent: () => getOpenDistance() + getExitDistance(),
            scale: 1.06,
            duration: 0.88,
          },
          1.5,
        )
        .to(
          shoji,
          {
            scale: () => getFinalScale(),
            filter: () => `blur(${getFinalBlur()})`,
            duration: 0.88,
          },
          1.5,
        )
        .to(
          [leftDoor, rightDoor],
          { autoAlpha: 0, filter: "blur(4px)", duration: 0.42 },
          1.86,
        )
        .to(base, { autoAlpha: 0, filter: "blur(6px)", duration: 0.56 }, 1.5)
        .to(roomGlow, { autoAlpha: 0.06, duration: 0.1 }, 1.72);

      timeline.to({}, { duration: getHoldDuration() });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.stage}>
        <div ref={roomGlowRef} className={styles.roomGlow} aria-hidden="true" />

        <div ref={shojiRef} className={styles.shojiLayer} aria-hidden="true">
          <div ref={baseRef} className={styles.baseWrap}>
            <Image
              src={SHOJI_BASE}
              alt=""
              fill
              sizes="100vw"
              className={styles.baseImage}
            />
          </div>

          <div ref={leftDoorRef} className={styles.leftDoor}>
            <Image
              src={SHOJI_LEFT}
              alt=""
              fill
              sizes="100vw"
              className={styles.doorImage}
            />
          </div>

          <div ref={rightDoorRef} className={styles.rightDoor}>
            <Image
              src={SHOJI_RIGHT}
              alt=""
              fill
              sizes="100vw"
              className={styles.doorImage}
            />
          </div>
        </div>

        <div ref={formRef} className={styles.formLayer}>
          <div className={styles.formShell}>
            <div className={styles.formHeader}>
              <Badge text="Disena tu viaje" variant="dark" align="center" />
              <h2 className={styles.title}>Bienvenido al salon privado</h2>
              <p className={styles.subtitle}>
                Cuentanos como imaginas tu viaje a Japon y te enviamos una
                propuesta personalizada.
              </p>
            </div>
            <form
              className={styles.formGrid}
              onSubmit={(event) => event.preventDefault()}
            >
              <label className={styles.field}>
                <span>Nombre completo</span>
                <input type="text" name="name" placeholder="Ej. Ana Garcia" />
              </label>

              <label className={styles.field}>
                <span>Email</span>
                <input type="email" name="email" placeholder="ana@email.com" />
              </label>

              <label className={styles.field}>
                <span>Fecha aproximada</span>
                <input type="text" name="date" placeholder="Octubre 2026" />
              </label>

              <label className={styles.field}>
                <span>Presupuesto estimado (USD)</span>
                <input type="text" name="budget" placeholder="8000 - 12000" />
              </label>

              <label className={`${styles.field} ${styles.fieldWide}`}>
                <span>Que tipo de experiencia buscas</span>
                <textarea
                  name="details"
                  rows={4}
                  placeholder="Ej. Ryokans, onsen, gastronomia, templos, fotografia..."
                />
              </label>

              <div className={styles.actions}>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.ctaButton}
                >
                  Comenzar mi viaje
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
