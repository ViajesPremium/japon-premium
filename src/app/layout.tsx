import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import MagneticCursor from "@/components/ui/MagneticCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";
import "./globals.css";
import "../styles/variables.css";
import Navbar from "@/layout/navbar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase define la URL base del sitio.
  metadataBase: new URL("https://japonpremium.com"),

  // Título principal del sitio.
  title: "Japón Premium | Viajes de lujo a Japón",

  // Descripción principal del sitio.
  // Es el texto que Google puede usar como snippet
  // en resultados de búsqueda.
  description:
    "Viajes de lujo a Japón diseñados a la medida, con atención personalizada, experiencias exclusivas y soporte en español.",

  // alternates.canonical le dice a Google cuál es la URL oficial
  // o canónica de esta página.
  // Esto ayuda a evitar problemas de contenido duplicado,
  // por ejemplo entre www y no-www.
  alternates: {
    canonical: "https://japonpremium.com",
  },

  // Open Graph controla cómo se ve tu página
  // cuando alguien la comparte en redes o apps
  // como Facebook, WhatsApp, LinkedIn, etc.
  openGraph: {
    // Título que se mostrará al compartir
    title: "Japón Premium | Viajes de lujo a Japón",

    // Descripción para la vista previa social
    description:
      "Viajes de lujo a Japón diseñados a la medida, con atención personalizada, experiencias exclusivas y soporte en español.",

    // URL oficial de la página compartida
    url: "https://japonpremium.com",

    // Nombre del sitio
    siteName: "Japón Premium",

    // Idioma / región principal del sitio
    locale: "es_MX",

    // Tipo de contenido
    // Como es una landing institucional/comercial,
    // lo correcto es "website"
    type: "website",

    // Imagen para compartir en redes.
    // Debe existir en /public para que funcione bien.
    // Ejemplo: /public/og-image.jpg
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Japón Premium - Viajes de lujo a Japón",
      },
    ],
  },

  // Metadata específica para Twitter / X.
  // Aunque muchas veces toma Open Graph,
  // conviene declararla explícitamente.
  twitter: {
    // Tipo de tarjeta. "summary_large_image"
    // muestra una imagen grande.
    card: "summary_large_image",

    // Título para Twitter / X
    title: "Japón Premium | Viajes de lujo a Japón",

    // Descripción para Twitter / X
    description:
      "Viajes de lujo a Japón diseñados a la medida, con atención personalizada y experiencias exclusivas.",

    // Imagen para la tarjeta de Twitter / X
    images: ["/og-image.jpg"],
  },

  // robots controla directivas SEO para buscadores.
  // Aquí estás diciendo que sí quieres indexación
  // y que sí quieres que sigan los enlaces.
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`antialiased ${dmSans.variable}`}>
      <body className="flex flex-col">
        <Navbar />
        <SmoothScroll>
          <MagneticCursor
            blendMode="exclusion"
            cursorColor="white"
            cursorSize={24}
            contrastBoost={1.5}
            disableOnTouch
          >
            {children}
          </MagneticCursor>
        </SmoothScroll>
      </body>
    </html>
  );
}
