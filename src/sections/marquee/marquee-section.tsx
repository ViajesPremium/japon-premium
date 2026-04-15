import LogoLoop, { type LogoItem } from "@/components/marquee";
import Badge from "@/components/ui/badge";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import styles from "./marquee-section.module.css";

const MARQUEE_LOGOS: LogoItem[] = [
  {
    src: "/logos/japon-grande-logo.png",
    alt: "Japon Premium",
    width: 420,
    height: 90,
  },
  {
    src: "/logos/japon-grande-logo.png",
    alt: "JP Logo",
    width: 280,
    height: 90,
  },
  {
    src: "/logos/japon-grande-logo.png",
    alt: "Japon Grande",
    width: 540,
    height: 120,
  },
  {
    src: "/logos/japon-grande-logo.png",
    alt: "Logo Japon",
    width: 380,
    height: 110,
  },
];

export default function MarqueeSection() {
  return (
    <section className={styles.section} aria-label="Marquee de logos">
      <div className={styles.container}>
        <div className={styles.header}>
          <Badge text="Nuestras alianzas" variant="dark" />
        </div>

        <div className={styles.stage}>
          <LogoLoop
            className={styles.marquee}
            logos={MARQUEE_LOGOS}
            speed={58}
            direction="left"
            logoHeight={72}
            gap={42}
            fadeOutColor="#f1f2f3"
            fadeOut
            pauseOnHover
          />
        </div>
      </div>
    </section>
  );
}
