import styles from "./hero.module.css"
import App from "../components/geisha-samurai"

export default function Hero() {
    return (
        <section className={styles.heroWrapper}>
            <div className={styles.hero}>
                <div className={styles.geishaSamurai}>
                    <App />
                </div>

            </div>

        </section>
    )
}