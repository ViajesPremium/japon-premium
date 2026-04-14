import styles from "./highlights.module.css";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";

export default function Highlights() {
  return (
    <section className={styles.highlights}>
      <div className={styles.container}>
        <BlurredStagger text="Ofreciendo" className={styles.title} />
        <BlurredStagger text="Experiencias" className={styles.title} />
      </div>
    </section>
  );
}
