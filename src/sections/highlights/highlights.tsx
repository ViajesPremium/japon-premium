import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";
import BracketHoverBox from "./bracket-hover-box";
import styles from "./highlights.module.css";

const FOCUS_RAIL_ITEMS: FocusRailItem[] = [
  {
    id: "kyoto-privado",
    title: "Kyoto Privado",
    description:
      "Accesos reservados, tiempos cuidados y acompanamiento premium.",
    meta: "Cultura",
    imageSrc: "/images/gallery-1.webp",
    href: "#contacto",
  },
  {
    id: "tokyo-nocturno",
    title: "Tokyo Nocturno",
    description: "Ciudad viva con rutas curated para cada estilo de viaje.",
    meta: "Urbano",
    imageSrc: "/images/gallery-2.webp",
    href: "#contacto",
  },
  {
    id: "onsen-premium",
    title: "Onsen Premium",
    description:
      "Rituales de descanso con hospedajes seleccionados por nuestro equipo.",
    meta: "Bienestar",
    imageSrc: "/images/gallery-3.webp",
    href: "#contacto",
  },
  {
    id: "sabores-omakase",
    title: "Sabores Omakase",
    description: "Experiencias gastronomicas privadas con enfoque autentico.",
    meta: "Gastronomia",
    imageSrc: "/images/gallery-4.webp",
    href: "#contacto",
  },
  {
    id: "paisajes-iconicos",
    title: "Paisajes Iconicos",
    description: "Escenarios emblema de Japon en momentos de baja saturacion.",
    meta: "Naturaleza",
    imageSrc: "/images/gallery-5.webp",
    href: "#contacto",
  },
  {
    id: "experiencia-ryokan",
    title: "Experiencia Ryokan",
    description:
      "Hospitalidad tradicional con estandares premium de principio a fin.",
    meta: "Tradicion",
    imageSrc: "/images/gallery-6.webp",
    href: "#contacto",
  },
];

export default function Highlights() {
  return (
    <section className={styles.highlights}>
      <div className={styles.container}>
        <div className={styles.badgeRow}>
          <Badge text="Por que Japon Premium?" variant="dark" align="center" />
        </div>

        <header className={styles.kicker}>
          <p className={styles.kickerTop}>Trabajamos con las mejores marcas</p>
          <p className={styles.kickerBottom}>De todo el mundo</p>
        </header>

        <div className={styles.editorialGrid}>
          <div className={styles.lineRow}>
            <p className={`${styles.megaText} ${styles.lineText}`}>
              TE LLEVAMOS
            </p>
            <BracketHoverBox
              className={styles.inlineBracket}
              imageSrc="/images/gallery-2.webp"
              imageAlt="Vista urbana de Osaka"
            >
              <p className={`${styles.ot} ${styles.flipInner}`}>OSAKA</p>
            </BracketHoverBox>
            <p className={`${styles.megaText} ${styles.lineText}`}>A</p>
          </div>

          <div className={styles.lineRow}>
            <p className={`${styles.megaText} ${styles.lineText}`}>
              VIVIR{" "}
              <span
                className={`${styles.japanWord} ${styles.secondaryUnderline}`}
              >
                JAPÓN
              </span>
            </p>
            <BracketHoverBox
              className={styles.inlineBracket}
              imageSrc="/images/kioto-japon.webp"
              imageAlt="Escena tradicional de Kioto"
            >
              <p className={`${styles.epochal} ${styles.flipInner}`}>KIOTO</p>
            </BracketHoverBox>
            <p className={`${styles.megaText} ${styles.lineText}`}>CON</p>
          </div>

          <div className={styles.lineRow}>
            <p className={`${styles.megaText} ${styles.lineText}`}>
              EL RESPALDO
            </p>
            <BracketHoverBox
              className={styles.inlineBracket}
              imageSrc="/images/gallery-1.webp"
              imageAlt="Paisaje iconico de Tokio"
            >
              <p className={`${styles.ot} ${styles.flipInner}`}>TOKIO</p>
            </BracketHoverBox>
            <p className={`${styles.megaText} ${styles.lineText}`}>Y LA</p>
          </div>

          <div className={styles.lineRow}>
            <p className={`${styles.megaText} ${styles.lineText}`}>
              ATENCIÓN QUE{" "}
              <span className={styles.secondaryUnderline}>MERECES</span>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.skiperSection}>
        <FocusRail items={FOCUS_RAIL_ITEMS} autoPlay={false} loop={true} />
      </div>

      <div className={styles.ctaRow}>
        <Button variant="primary">Crear mi viaje</Button>
        <Button variant="secondary">Faqs</Button>
      </div>
    </section>
  );
}
