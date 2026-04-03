import React from "react"
import { InfoCard } from "@/components/ui/info-card"
import "./info-card-grid.css"

const cards = [
  {
    className: "infoCardsGrid__item--american",
    image:
      "https://images.unsplash.com/photo-1567777285486-8af9bfd5d7db?q=80&w=1920&auto=format&fit=crop",
    title: "American English",
    description:
      "Master American English efficiently with personalized lessons, cultural insights, and practical exercises.",
  },
  {
    className: "infoCardsGrid__item--british",
    image:
      "https://images.unsplash.com/photo-1448906654166-444d494666b3?q=80&w=1920&auto=format&fit=crop",
    title: "British English",
    description:
      "Explore British English nuances, from pronunciation to idioms and dialect-specific words.",
  },
  {
    className: "infoCardsGrid__item--hebrew",
    image:
      "https://images.unsplash.com/photo-1618415112746-d999da95f609?q=80&w=1920&auto=format&fit=crop",
    title: "עברית",
    description:
      "לימוד השפה העברית המודרנית, דקדוק ואוצר מילים. שיפור מיומנויות דיבור וכתיבה, חקירת ספרות עברית. הכרת תרבות ישראלית, מנהגים והיסטוריה.",
  },
]

export const Demo: React.FC = () => {
  return (
    <section className="infoCardsGrid" aria-label="Language cards">
      {cards.map((card) => (
        <article
          key={card.title}
          className={`infoCardsGrid__item ${card.className}`}
        >
          <InfoCard
            image={card.image}
            title={card.title}
            description={card.description}
            borderColor="var(--info-card-theme-border-color)"
            borderBgColor="var(--info-card-border-bg)"
            cardBgColor="var(--info-card-surface)"
            shadowColor="var(--info-card-shadow)"
            textColor="var(--info-card-text)"
            hoverTextColor="var(--info-card-theme-hover-text)"
            fontFamily="var(--info-card-font)"
            rtlFontFamily="var(--info-card-rtl-font)"
            effectBgColor="var(--info-card-theme-effect-bg)"
            patternColor1="var(--info-card-pattern-1)"
            patternColor2="var(--info-card-pattern-2)"
            contentPadding="14px 16px"
          />
        </article>
      ))}
    </section>
  )
}
