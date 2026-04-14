import styles from "./trust-strip.module.css";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import BentoGrid from "./BentoGrid";
import Badge from "@/components/ui/badge";

export default function Snapshot() {
  return (
    <section className={styles.snapshot}>
      <div className={styles.postersWrapper}></div>
      <div className={styles.snapshotContent}>
        <Badge text="Nueva seccion" variant="dark" />
        <BlurredStagger
          text="Más de 19 años creando experiencias premium."
          className={styles.trustStrip}
          highlights={[
            {
              word: "19",
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
