import styles from "./highlights.module.css";
import { Skiper34 } from "@/components/ui/cards-reveal";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import { Button } from "@/components/ui/button";

export default function Highlights() {
  return (
    <section className={styles.highlights}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Experiencia <span className={styles.highlight}>Premium</span>{" "}
            completa.
          </h2>
          <TextBlockAnimation blockColor="var(--white)" className={styles.text}>
            Hoteles cuidadosamente seleccionados, itinerarios que equilibran
            cultura, descanso, gastronomía y exclusividad, y una experiencia
            personalizada según tu estilo de viaje.
          </TextBlockAnimation>
        </div>
        <Button className={styles.button} variant="primary">
          Quiero mi experiencia Premium
        </Button>
      </div>
      <Skiper34 />
    </section>
  );
}
