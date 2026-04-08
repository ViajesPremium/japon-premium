import styles from "./trust-strip.module.css";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import BentoGrid from "./BentoGrid";

export default function Snapshot() {
  return (
    <section className={styles.snapshot}>
      <div className={styles.postersWrapper}></div>
      <div className={styles.snapshotContent}>
        <BlurredStagger
          text="Más de 19 años creando experiencias premium."
          className={styles.trustStrip}
        />
        <BentoGrid />
      </div>
    </section>
  );
}
