"use client"

import React, { useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import "./info-card.css"

function isRTL(text: string) {
  return /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text)
}

export interface InfoCardProps {
  image: string
  title: string
  description: string
  width?: number
  height?: number
  borderColor?: string
  borderBgColor?: string
  borderWidth?: number
  borderPadding?: number
  cardBgColor?: string
  shadowColor?: string
  patternColor1?: string
  patternColor2?: string
  textColor?: string
  hoverTextColor?: string
  fontFamily?: string
  rtlFontFamily?: string
  effectBgColor?: string
  contentPadding?: string
}

export const InfoCard: React.FC<InfoCardProps> = ({
  image,
  title,
  description,
  width = 388,
  height = 378,
  borderColor = "#DAFF3E",
  borderBgColor = "#242424",
  borderWidth = 3,
  borderPadding = 14,
  cardBgColor = "#000",
  shadowColor = "rgba(0, 0, 0, 0.45)",
  patternColor1 = "rgba(230, 230, 230, 0.15)",
  patternColor2 = "rgba(240, 240, 240, 0.15)",
  textColor = "#f5f5f5",
  hoverTextColor = "#242424",
  fontFamily = "'Roboto Mono', monospace",
  rtlFontFamily = "'Montserrat', sans-serif",
  effectBgColor = "#DAFF3E",
  contentPadding = "10px 16px",
}) => {
  const [hovered, setHovered] = useState(false)
  const borderRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const border = borderRef.current
    if (!border) return
    const rect = border.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const angle = Math.atan2(y, x)
    border.style.setProperty("--rotation", `${angle}rad`)
  }

  const rtl = isRTL(title) || isRTL(description)
  const titleDirection = isRTL(title) ? "rtl" : "ltr"
  const descDirection = isRTL(description) ? "rtl" : "ltr"
  const effectiveFont = rtl ? rtlFontFamily : fontFamily

  const cardVars = {
    "--info-card-width": `${width}px`,
    "--info-card-height": `${height}px`,
    "--info-card-border-width": `${borderWidth}px`,
    "--info-card-border-padding": `${borderPadding}px`,
    "--info-card-card-bg": cardBgColor,
    "--info-card-border-color": borderColor,
    "--info-card-border-bg": borderBgColor,
    "--info-card-shadow": shadowColor,
    "--info-card-pattern-1": patternColor1,
    "--info-card-pattern-2": patternColor2,
    "--info-card-text": textColor,
    "--info-card-hover-text": hoverTextColor,
    "--info-card-effect-bg": effectBgColor,
    "--info-card-content-padding": contentPadding,
    "--info-card-font": effectiveFont,
  } as CSSProperties

  return (
    <div
      ref={borderRef}
      className={`infoCard${hovered ? " is-hovered" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        if (borderRef.current) {
          borderRef.current.style.setProperty("--rotation", "0deg")
        }
      }}
      style={cardVars}
    >
      <div className="infoCard__inner">
        <div className="infoCard__media">
          <Image
            src={image}
            alt={title}
            className="infoCard__image"
            fill
            sizes="(max-width: 480px) 100vw, 388px"
          />
        </div>

        <div className="infoCard__content">
          <h3 className="infoCard__title" dir={titleDirection}>
            <span className="infoCard__titleText">{title}</span>
            <span className="infoCard__titleEffect" aria-hidden="true" />
          </h3>

          <p className="infoCard__description" dir={descDirection}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
