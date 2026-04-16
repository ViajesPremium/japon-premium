import Hero from "@/layout/hero";
import Snapshot from "@/sections/snapshot/trust-strip";
import ImgSection from "@/sections/image/image-section";
import Itinerary from "@/sections/itinerarios/itinerary";
import Highlights from "@/sections/highlights/highlights";
import Includes from "@/sections/includes/includes";
import Testimonials from "@/sections/testimonios/testimonials";
import Faqs from "@/sections/faqs/faqs";
import CTAForm from "@/sections/form/ctaForm";
import MarqueeSection from "@/sections/marquee/marquee-section";
import Footer from "@/sections/footer/footer";

export default function Home() {
  return (
    <main style={{ isolation: "isolate" }}>
      <section
        className="relative w-full overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <Hero />
      </section>

      <section
        className="relative w-full overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <Snapshot />
      </section>

      <section
        className="w-full overflow-hidden"
        style={{ height: "100vh", position: "relative", zIndex: 2 }}
      >
        <ImgSection />
      </section>

      <section className="w-full overflow-visible" style={{ zIndex: 2 }}>
        <Highlights />
      </section>

      <section
        className="relative w-full overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <Itinerary />
      </section>

      {/* overflow-hidden eliminado: el pin-spacer de GSAP necesita
          expandir el wrapper sin que overflow lo interfiera */}
      <section className="relative w-full" style={{ zIndex: 2 }}>
        <Includes />
      </section>

      {/* 1. marginTop: "-100vh" jala la sección hacia arriba para que suba y cubra a .includes
        2. background: "#ffffff" (o tu color) es VITAL para que tape lo de abajo
      */}
      <section
        className="relative w-full overflow-hidden bg-white dark:bg-black"
        style={{
          zIndex: 3,
          transform: "translateZ(0)",
          marginTop: "-100vh" /* <-- ESTA ES LA MAGIA */,
        }}
      >
        <Testimonials />
      </section>

      <section
        className="relative w-full overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <Faqs />
      </section>

      <section className="w-full overflow-hidden" style={{ zIndex: 2 }}>
        <CTAForm />
      </section>

      <section
        className="relative w-full overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <MarqueeSection />
      </section>

      {/* Footer sticky - z-index 0, las secciones lo revelan al hacer scroll */}
      <Footer />
    </main>
  );
}
