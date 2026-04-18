"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import styles from "./image-section.module.css";

const STRENGTH = 18;

export default function ImgSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Efecto Parallax opcional (puedes vincularlo a un onMouseMove en el section si lo deseas)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 20 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });
  const imgX = useTransform(x, [-1, 1], [-STRENGTH, STRENGTH]);
  const imgY = useTransform(y, [-1, 1], [-STRENGTH, STRENGTH]);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Fondo con movimiento */}
      <motion.div
        className={styles.img}
        aria-hidden="true"
        style={{ x: imgX, y: imgY }}
      />
      <div className={styles.imgOverlay} aria-hidden="true" />

      {/* Contenedor del contenido */}
      <div className={styles.inner}>
        {/* Izquierda: Formulario */}
        <div className={styles.left}>
          <form className={styles.formContainer}>
            <div className={styles.formHead}>
              <p className={styles.formEyebrow}>Asesoria Privada</p>
              <h3 className={styles.formTitle}>Disena tu viaje a Japon</h3>
              <p className={styles.formSub}>
                Un itinerario curado a tu ritmo, con acompanamiento experto.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Nombre
              </label>
              <input
                type="text"
                id="name"
                className={styles.formInput}
                placeholder="Tu nombre"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Correo
              </label>
              <input
                type="email"
                id="email"
                className={styles.formInput}
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="interest" className={styles.formLabel}>
                Destino de interés
              </label>
              <input
                type="text"
                id="interest"
                className={styles.formInput}
                placeholder="Ej. Kioto, Tokio..."
              />
            </div>

            <Button type="button" variant="primary">
              Solicita tu propuesta
            </Button>
          </form>
        </div>

        {/* Derecha: Vacío para dejar ver la imagen de la geisha */}
        <div className={styles.right}></div>
      </div>
    </section>
  );
}
