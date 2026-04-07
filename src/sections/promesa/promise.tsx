import TextBlockAnimation from "@/components/ui/text-block-animation";
import styles from "./promise.module.css";
import Carrousel from "@/components/ui/carrousel";
import { Button } from "@/components/ui/button";

export default function Promise() {
  return (
    <section className={styles.promise}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          No se trata solo de visitar{" "}
          <span className={styles.highlight}>Japón</span>.
        </h2>
        <TextBlockAnimation
          blockColor="#000"
          className={styles.text}
        >
          Se trata de vivirlo con el nivel de detalle, comodidad y cuidado que
          transforma un viaje en una experiencia extraordinaria.
        </TextBlockAnimation>
        <Button className={styles.button} variant="primary">
          Quiero vivirlo
        </Button>
      </div>
      <Carrousel />
    </section>
  );
}
