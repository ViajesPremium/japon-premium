import styles from "./highlights.module.css";
import Badge from "@/components/ui/badge";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import { HoverImageGallery } from "@/components/hover-image-gallery";
import { Button } from "@/components/ui/button";
import TextType from "@/components/ui/TextType";

const HIGHLIGHT_IMAGES = [
  "/images/gallery-7.webp",
  "/images/gallery-2.webp",
  "/images/gallery-3.webp",
  "/images/gallery-4.webp",
  "/images/gallery-5.webp",
  "/images/gallery-6.webp",
  "/images/gallery-1.webp",
];

export default function Highlights() {
  return (
    <section className={styles.highlights}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.copyColumn}>
            <div className={styles.badgeWrap}>
              <Badge text="Experiencias Destacadas" variant="dark" />
            </div>

            <div>
              <BlurredStagger
                text="Creando"
                className={`${styles.title} ${styles.titleGradient}`}
                highlights={[
                  {
                    word: "Creando",
                    useGradient: true,
                    gradientColors: [
                      "#BF953F",
                      "#FCF6BA",
                      "#B38728",
                      "#FCF6BA",
                    ],
                    gradientSpeed: 6,
                  },
                ]}
              />

              <TextType
                as="h2"
                text="Experiencias"
                className={`${styles.title} ${styles.titleType}`}
                showCursor={true}
                loop={true}
                startOnVisible
                typingSpeed={120}
                deletingSpeed={35}
                initialDelay={120}
              />
            </div>

            <p className={styles.subtitle}>
              Diseñamos momentos inolvidables en Japón, con curaduría premium y
              acompañamiento de principio a fin.
            </p>

            <Button variant="primary" className={styles.cta}>
              Quiero mi viaje
            </Button>
          </div>

          <div className={styles.galleryColumn}>
            <HoverImageGallery
              images={HIGHLIGHT_IMAGES}
              className={styles.gallery}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
