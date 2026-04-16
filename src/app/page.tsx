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
import PageSectionBadge from "@/components/ui/page-section-badge";

export default function Home() {
  return (
    <main className="isolate">
      <PageSectionBadge />

      <section
        id="home-hero"
        data-page-badge="Inicio"
        data-badge-variant="light"
        className="relative z-[1] w-full overflow-hidden"
      >
        <Hero />
      </section>

      <section
        id="home-snapshot"
        data-page-badge="Nueva seccion"
        data-badge-variant="dark"
        className="relative z-[2] w-full overflow-hidden"
      >
        <Snapshot />
      </section>

      <section
        id="home-image"
        data-page-badge="Nuestra promesa"
        data-badge-variant="light"
        className="relative z-[3] h-screen w-full overflow-hidden bg-white dark:bg-black"
      >
        <ImgSection />
      </section>

      <section
        id="home-highlights"
        data-page-badge="Por que Japon Premium"
        data-badge-variant="dark"
        className="relative z-[3] w-full overflow-visible bg-white dark:bg-black"
      >
        <Highlights />
      </section>

      <section
        id="home-itinerary"
        data-page-badge="Itinerario"
        data-badge-variant="light"
        className="relative z-[2] -mt-[100vh] w-full overflow-hidden bg-black"
      >
        <Itinerary />
      </section>

      <section
        id="home-includes"
        data-page-badge="Incluimos"
        data-badge-variant="light"
        className="relative z-[3] w-full bg-black"
      >
        <Includes />
      </section>

      <section
        id="home-testimonials"
        data-page-badge="Testimonios"
        data-badge-variant="dark"
        className="relative z-[2] -mt-[100vh] w-full overflow-hidden bg-white dark:bg-black"
      >
        <Testimonials />
      </section>

      <section
        id="home-faqs"
        data-page-badge="Preguntas frecuentes"
        data-badge-variant="dark"
        className="relative z-[2] w-full overflow-hidden"
      >
        <Faqs />
      </section>

      <section
        id="home-form"
        data-page-badge="Disena tu viaje"
        data-badge-variant="dark"
        className="relative z-[2] w-full overflow-hidden"
      >
        <CTAForm />
      </section>

      <section
        id="home-marquee"
        data-page-badge="Alianzas"
        data-badge-variant="dark"
        className="relative z-[2] w-full overflow-hidden"
      >
        <MarqueeSection />
      </section>

      <Footer />
    </main>
  );
}
