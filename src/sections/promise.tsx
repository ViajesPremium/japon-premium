import ScrollReveal from "@/components/ui/ScrollReveal";
import styles from "./promise.module.css";
import Carrousel from '@/components/ui/carrousel'
import { Button } from "@/components/ui/button";

export default function Promise() {
    return (
        <section className={styles.promise}>

            <div className={styles.container}>
                <h2 className={styles.title}>No se trata solo de visitar <span className={styles.highlight}>Japón</span>.</h2>
                <ScrollReveal
                    baseOpacity={0.1}
                    enableBlur
                    baseRotation={3}
                    blurStrength={2}
                    containerClassName={styles.text}
                >
                    Se trata de vivirlo con el nivel de detalle, comodidad y
                    cuidado que transforma un viaje en una experiencia extraordinaria.
                </ScrollReveal>
                <Button className={styles.button} variant="primary">Quiero vivirlo</Button>
            </div>
            <Carrousel />
        </section>
    )
}