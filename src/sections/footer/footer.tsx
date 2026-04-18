"use client";

import { useCallback } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import styles from "./footer.module.css";

const samuraiMain = "/images/samurai4.webp";
const footerBrandLogo = "/logos/japon-grande-logo.png";
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

const ADDRESS =
  "Cda. de Omega 306, Romero de Terreros, Coyoacan, 04310 Ciudad de Mexico, CDMX";
const MAP_QUERY = encodeURIComponent(ADDRESS);
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;
const GOOGLE_MAPS_OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

const CONTACT_EMAIL = "hola@japonpremium.com";
const CONTACT_PHONE_DISPLAY = "+52 55 1234 5678";
const CONTACT_PHONE_LINK = "+525512345678";

const PAGE_LINKS = [
  { label: "INICIO", href: "#inicio" },
  { label: "HIGHLIGHTS", href: "#highlights" },
  { label: "ITINERARIOS", href: "#itinerarios" },
  { label: "CONTACTO", href: "#contacto" },
] as const;

const SOCIAL_LINKS = [
  { label: "TIKTOK", href: "#" },
  { label: "INSTAGRAM", href: "#" },
  { label: "YOUTUBE", href: "#" },
] as const;

export default function Footer() {
  const handleBackToTop = useCallback(() => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5, easing: easeOutQuint });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className={styles.footer}>
      {/* Rounded cap that covers the section above */}
      <div className={styles.topCap} />

      {/* ── Main wrapper: visual hero + content overlaid ── */}
      <div className={styles.wrapper}>
        {/* Visual centrepiece: logo (z1) + samurai (z2) */}
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.logoLayer}>
            <div className={styles.logoWrap}>
              <Image
                src={footerBrandLogo}
                alt=""
                fill
                sizes="(max-width: 768px) 80vw, 55vw"
                loading="lazy"
                className={styles.logoImg}
              />
            </div>
          </div>

          {/* samuraiLayer posiciona (left 50% / translateX -50%) */}
          {/* motion.div anima solo Y sin pisar el translateX del padre */}
          <div className={styles.samuraiLayer}>
            <motion.div
              className={styles.samuraiMotion}
              initial={{ y: 120, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className={styles.samuraiWrap}>
                <Image
                  src={samuraiMain}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 70vw, 36vw"
                  loading="lazy"
                  className={styles.samuraiImg}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Content grid (3-col desktop / 2-col mobile) ── */}
        <div className={styles.contentGrid}>
          {/* LEFT — Páginas + mapa */}
          <div className={styles.colLeft}>
            <div className={styles.navSection}>
              <span className={styles.sectionLabel}>PÁGINAS</span>
              <nav className={styles.navLinks}>
                {PAGE_LINKS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={styles.navLink}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className={styles.mapCard}>
              <p className={styles.mapAddress}>{ADDRESS}</p>
              <div className={styles.mapFrameWrap}>
                <iframe
                  title="Ubicacion Japon Premium"
                  src={GOOGLE_MAPS_EMBED_URL}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={GOOGLE_MAPS_OPEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapButton}
              >
                Abrir en Google Maps
              </a>
            </div>
          </div>

          {/* CENTER — spacer so visual shows through on desktop */}
          <div className={styles.centerGap} aria-hidden="true" />

          {/* RIGHT — Redes + contacto */}
          <div className={styles.colRight}>
            <div className={styles.navSection}>
              <span className={styles.sectionLabel}>SÍGUENOS</span>
              <nav className={styles.navLinks}>
                {SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={styles.navLink}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className={styles.contactCard}>
              <p className={styles.contactLabel}>CONTACTO DIRECTO</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={styles.contactLink}
              >
                {CONTACT_EMAIL}
              </a>
              <a
                href={`tel:${CONTACT_PHONE_LINK}`}
                className={styles.contactLink}
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
        {/* /contentGrid */}
      </div>
      {/* /wrapper */}

      {/* ── Bottom bar ── */}
      <div className={styles.bottomBar}>
        <p className={styles.copy}>
          © 2026 Viaja a Japón Premium. Todos los derechos reservados.
        </p>

        <button
          type="button"
          onClick={handleBackToTop}
          className={styles.backToTopBtn}
          aria-label="Volver al inicio"
        >
          Volver al inicio
        </button>

        <div className={styles.legalLinks}>
          <a href="#">PRIVACIDAD</a>
          <a href="#">TÉRMINOS</a>
        </div>
      </div>
    </footer>
  );
}
