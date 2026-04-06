import Footer from "@/layout/footer";
import Hero from "@/layout/hero";
import Navbar from "@/layout/navbar";
import Promise from "@/sections/promesa/promise";
import Highlights from "@/sections/highlights/highlights";
import Audience from "@/sections/audiencia/audience";
import Enamorate from "@/sections/enamorate/fall-in-love";
import Snapshot from "@/sections/snapshot/snapshot";
import Testimonials from "@/sections/testimonios/testimonials";
import CTAForm from "@/sections/form/ctaForm";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Snapshot />
      <Enamorate />
      <Promise />
      <Highlights />
      <Audience />
      <Testimonials />
      <CTAForm />
      <Footer />
    </main>
  );
}
