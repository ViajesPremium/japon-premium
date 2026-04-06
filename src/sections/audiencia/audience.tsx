import styles from "./audience.module.css"
import ScrollReveal from "@/components/ui/ScrollReveal"

export default function Audience() {
    return (
        <section className={styles.audience}>
            <div className={styles.container}>
                <h2 className={styles.title}>Para quién es esta experiencia</h2>
                <ScrollReveal
                    baseOpacity={0.1}
                    enableBlur
                    baseRotation={3}
                    blurStrength={2}
                    containerClassName={styles.text}
                >
                    Viajeros que buscan una inmersión cultural auténtica, con comodidad y exclusividad.
                    Personas que valoran la gastronomía, la historia y las experiencias únicas.
                    Quienes desean explorar Japón con una guía experta que optimice su tiempo y recursos.
                </ScrollReveal>
            </div>
        </section>
    )
}