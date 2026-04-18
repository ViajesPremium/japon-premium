import Hero from "@/layout/hero";
import Snapshot from "@/sections/snapshot/trust-strip";
import ImgSection from "@/sections/image/image-section";
import Itinerary from "@/sections/itinerarios/itinerary";
import Highlights from "@/sections/highlights/highlights";
import Includes from "@/sections/includes/includes";
import Testimonials from "@/sections/testimonios/testimonials";
import InterludeSection from "@/sections/interlude/interlude";
import Faqs from "@/sections/faqs/faqs";
import CTAForm from "@/sections/form/ctaForm";
import MarqueeSection from "@/sections/marquee/marquee-section";
import Footer from "@/sections/footer/footer";

export default function Home() {
  return (
    <main className="isolate">
      <section id="inicio" className="relative z-[1] w-full overflow-hidden">
        <Hero />
      </section>

      <section className="relative z-[2] w-full overflow-hidden">
        <Snapshot />
      </section>

      <section className="relative z-[1] h-auto min-h-[100svh] w-full overflow-hidden bg-white dark:bg-black md:z-[3] md:h-screen">
        <ImgSection />
      </section>

      <section
        id="highlights"
        className="relative z-[3] w-full overflow-visible bg-white dark:bg-black"
      >
        <Highlights />
      </section>

      <section
        id="itinerarios"
        className="relative z-[2] w-full overflow-hidden bg-black md:-mt-[100vh]"
      >
        <Itinerary />
      </section>

      <section id="includes" className="relative z-[3] w-full bg-black">
        <Includes />
      </section>

      <section
        id="testimonios"
        className="relative z-[2] mt-0 w-full overflow-hidden bg-white dark:bg-black md:-mt-[100vh]"
      >
        <Testimonials />
      </section>

      <section className="relative z-[2] w-full overflow-hidden bg-white dark:bg-black">
        <InterludeSection />
      </section>

      <section id="faqs" className="relative z-[2] w-full overflow-hidden">
        <Faqs />
      </section>

      <section id="contacto" className="relative z-[2] w-full overflow-hidden">
        <CTAForm />
      </section>

      <section className="relative z-[2] w-full overflow-hidden">
        <MarqueeSection />
      </section>

      <Footer />
    </main>
  );
}
