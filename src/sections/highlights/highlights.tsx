import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";
import BracketHoverBox from "./bracket-hover-box";
import styles from "./highlights.module.css";

const FOCUS_RAIL_ITEMS: FocusRailItem[] = [
  {
    id: "kyoto-privado",
    title: "Recorridos diseñados con más criterio",
    description:
      "Cada itinerario se estructura para dar más sentido, ritmo y calidad al viaje.",
    meta: "Cultura",
    imageSrc: "/images/gallery-1.webp",
    href: "#contacto",
  },
  {
    id: "tokyo-nocturno",
    title: "Acompañamiento personalizado",
    description:
      "Atención cercana antes, durante y después de su experiencia en Japón.",
    meta: "Urbano",
    imageSrc: "/images/gallery-2.webp",
    href: "#contacto",
  },
  {
    id: "sabores-omakase",
    title: "Respaldo 24/7",
    description:
      "Soporte continuo para viajar con tranquilidad de principio a fin.",
    meta: "Gastronomia",
    imageSrc: "/images/gallery-4.webp",
    href: "#contacto",
  },
  {
    id: "onsen-premium",
    title: "Estancias a la altura del viaje",
    description:
      "Seleccionadas por su carácter, ubicación y nivel de servicio.",
    meta: "Bienestar",
    imageSrc: "/images/gallery-3.webp",
    href: "#contacto",
  },

  {
    id: "paisajes-iconicos",
    title: "Expertos que hablan su idioma",
    description:
      "Guías en español para vivir Japón con más claridad y profundidad.",
    meta: "Naturaleza",
    imageSrc: "/images/gallery-5.webp",
    href: "#contacto",
  },
  {
    id: "experiencia-ryokan",
    title: "Tranquilidad de principio a fin",
    description:
      "Cada detalle se cuida para que usted viaje con más confianza y respaldo.",
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
          <Badge text="¿Por qué Japón Premium?" variant="dark" align="center" />
        </div>

        <header className={styles.kicker}>
          <BlurredStagger
            text="Trabajamos con marcas"
            className={styles.kickerTop}
          />
          <p className={styles.kickerBottom}>Cuidadosamente seleccionadas.</p>
        </header>

        <div className={styles.editorialGrid}>
          <div className={`${styles.lineRow} ${styles.lineRowWithBracket}`}>
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

          <div className={`${styles.lineRow} ${styles.lineRowWithBracket}`}>
            <BlurredStagger
              text="VIVIR JAPÓN"
              className={`${styles.megaText} ${styles.lineText}`}
              highlights={[
                {
                  word: "JAPÓN",
                  className: `${styles.japanWord} ${styles.secondaryUnderline}`,
                },
              ]}
            />
            <BracketHoverBox
              className={styles.inlineBracket}
              imageSrc="/images/kioto-japon.webp"
              imageAlt="Escena tradicional de Kioto"
            >
              <p className={`${styles.epochal} ${styles.flipInner}`}>KIOTO</p>
            </BracketHoverBox>
            <p className={`${styles.megaText} ${styles.lineText}`}>CON</p>
          </div>

          <div className={`${styles.lineRow} ${styles.lineRowWithBracket}`}>
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
            <BlurredStagger
              text="ATENCIÓN QUE MERECES"
              className={`${styles.megaText} ${styles.lineText}`}
              highlights={[
                { word: "MERECES", className: styles.secondaryUnderline },
              ]}
            />
          </div>
        </div>

        <div className={styles.editorialGridMobile}>
          <BlurredStagger
            text="TE LLEVAMOS A"
            className={`${styles.megaText} ${styles.mobileLine}`}
          />
          <BlurredStagger
            text="VIVIR JAPÓN"
            className={`${styles.megaText} ${styles.mobileLine}`}
            highlights={[
              {
                word: "JAPÓN",
                className: `${styles.japanWord} ${styles.secondaryUnderline}`,
              },
            ]}
          />
          <BlurredStagger
            text="CON"
            className={`${styles.megaText} ${styles.mobileLine}`}
          />
          <BlurredStagger
            text="EL RESPALDO"
            className={`${styles.megaText} ${styles.mobileLine}`}
          />
          <BlurredStagger
            text="Y LA"
            className={`${styles.megaText} ${styles.mobileLine}`}
          />
          <BlurredStagger
            text="ATENCIÓN QUE"
            className={`${styles.megaText} ${styles.mobileLine}`}
          />
          <BlurredStagger
            text="MERECES"
            className={`${styles.megaText} ${styles.mobileLine}`}
            highlights={[
              { word: "MERECES", className: styles.secondaryUnderline },
            ]}
          />
        </div>
      </div>

      <div className={styles.skiperSection}>
        <FocusRail items={FOCUS_RAIL_ITEMS} autoPlay={false} loop={true} />
      </div>

      <div className={styles.ctaRow}>
        <Button variant="primary">Solicita tu propuesta</Button>
        <Button variant="secondary">Ver itinerarios</Button>
      </div>
    </section>
  );
}
