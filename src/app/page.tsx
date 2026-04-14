import Hero from "@/layout/hero";
import Snapshot from "@/sections/snapshot/trust-strip";
import ImgSection from "@/sections/image/image-section";
import Itinerary from "@/sections/itinerarios/itinerary";
import Includes from "@/sections/includes/includes";
import Highlights from "@/sections/highlights/highlights";
import Testimonials from "@/sections/testimonios/testimonials";
import Faqs from "@/sections/faqs/faqs";
import CTAForm from "@/sections/form/ctaForm";
import Footer from "@/sections/footer/footer";

export default function Home() {
  return (
    <main style={{ isolation: "isolate" }}>
      {/* Secciones con z-index positivo para tapar el footer sticky */}
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

      <section
        className="relative w-full overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <Itinerary />
      </section>

      <section
        className="relative w-full overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <Includes />
      </section>

      <section
        className="relative w-full overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <Testimonials />
      </section>

      <section
        className="relative w-full overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <Faqs />
      </section>

      <section
        className="relative w-full overflow-hidden"
        style={{ zIndex: 2 }}
      >
        <CTAForm />
      </section>

      {/* Footer sticky - z-index 0, las secciones lo revelan al hacer scroll */}
      <Footer />
    </main>
  );
}
