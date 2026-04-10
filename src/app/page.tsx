import Footer from "@/layout/footer";
import Hero from "@/layout/hero";
import Navbar from "@/layout/navbar";
import Promise from "@/sections/promesa/promise";
import Highlights from "@/sections/highlights/highlights";
import Audience from "@/sections/audiencia/audience";
import Enamorate from "@/sections/enamorate/fall-in-love";
import Snapshot from "@/sections/snapshot/trust-strip";
import Testimonials from "@/sections/testimonios/testimonials";
import CTAForm from "@/sections/form/ctaForm";
import ImgSection from "@/sections/image/image-section";
import CardsStackSection from "@/sections/cards-stack/cards-stack-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <Snapshot />
      <div
        className="snap-section"
        style={{ height: "100vh", position: "relative" }}
      >
        <ImgSection />
      </div>
      <CardsStackSection />
    </main>
  );
}
