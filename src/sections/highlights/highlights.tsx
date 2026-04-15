import Badge from "@/components/ui/badge";
import Skiper54 from "@/components/skiper54";
import { Button } from "@/components/ui/button";
import styles from "./highlights.module.css";

const SKIPER_IMAGES = [
  {
    src: "/images/gallery-1.webp",
    alt: "Kyoto Privado",
    title: "Kyoto Privado",
  },
  {
    src: "/images/gallery-2.webp",
    alt: "Tokyo Nocturno",
    title: "Tokyo Nocturno",
  },
  {
    src: "/images/gallery-3.webp",
    alt: "Onsen Premium",
    title: "Onsen Premium",
  },
  {
    src: "/images/gallery-4.webp",
    alt: "Sabores Omakase",
    title: "Sabores Omakase",
  },
  {
    src: "/images/gallery-5.webp",
    alt: "Paisajes Iconicos",
    title: "Paisajes Iconicos",
  },
  {
    src: "/images/gallery-6.webp",
    alt: "Experiencia Ryokan",
    title: "Experiencia Ryokan",
  },
];

export default function Highlights() {
  return (
    <section className={styles.highlights}>
      <div className={styles.container}>
        <div className={styles.badgeRow}>
          <Badge text="Por que Japon Premium?" variant="dark" />
        </div>

        <header className={styles.kicker}>
          <p className={styles.kickerTop}>Trabajamos con las mejores marcas</p>
          <p className={styles.kickerBottom}>De todo el mundo</p>
        </header>

        <div className={styles.editorialGrid}>
          <p className={`${styles.megaText} ${styles.weHelp}`}>TODA</p>

          <div className={`${styles.bracketBox} ${styles.standard}`}>
            <span>The Standard</span>
          </div>

          <h2 className={`${styles.megaText} ${styles.rightLine}`}>
            LA CALIDAD,
          </h2>

          <div className={`${styles.bracketBox} ${styles.epochalWrap}`}>
            <p className={styles.epochal}>epochal</p>
          </div>

          <h2 className={`${styles.megaText} ${styles.rightLine}`}>
            EXPERIENCIA,
          </h2>

          <p className={`${styles.megaText} ${styles.andWord}`}>Y EL</p>

          <div className={`${styles.bracketBox} ${styles.otWrap}`}>
            <p className={styles.ot}>OT</p>
          </div>

          <h2 className={`${styles.megaText} ${styles.rightLine}`}>CUIDADO</h2>
        </div>
      </div>

      <div className={styles.skiperSection}>
        <Skiper54
          images={SKIPER_IMAGES}
          autoplay={false}
          loop={false}
          showNavigation={false}
        />
      </div>
      <p className={styles.footerCopy}>Y estamos contigo hasta el final</p>
      <div className={styles.ctaRow}>
        <Button variant="primary">Diseña tu viaje</Button>
      </div>
    </section>
  );
}
