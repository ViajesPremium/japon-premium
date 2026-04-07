import styles from "./audience.module.css"
import TextBlockAnimation from "@/components/ui/text-block-animation"

export default function Audience() {
    return (
        <section className={styles.audience}>
            <div className={styles.container}>
                <h2 className={styles.title}>Para quién es esta experiencia</h2>
                <TextBlockAnimation
                    blockColor="#000"
                    className={styles.text}
                >
                    Viajeros que buscan una inmersión cultural auténtica, con comodidad y exclusividad.
                    Personas que valoran la gastronomía, la historia y las experiencias únicas.
                    Quienes desean explorar Japón con una guía experta que optimice su tiempo y recursos.
                </TextBlockAnimation>
            </div>
        </section>
    )
}