import Hero from "@/layout/hero";
import Snapshot from "@/sections/snapshot/trust-strip";
import ImgSection from "@/sections/image/image-section";
import Itinerary from "@/sections/itinerarios/itinerary";

export default function Home() {
  return (
    <main>
      {/* Añadimos relative, w-full y sobre todo overflow-hidden a cada sección */}
      <section className="snap-section relative w-full overflow-hidden">
        <Hero />
      </section>

      <section className="snap-section relative w-full overflow-hidden">
        <Snapshot />
      </section>

      {/* Aquí ya tenías position relative, así que solo agregamos overflow-hidden y w-full */}
      <section
        className="snap-section w-full overflow-hidden"
        style={{ height: "100vh", position: "relative" }}
      >
        <ImgSection />
      </section>

      <section className="snap-section relative w-full overflow-hidden">
        <Itinerary />
      </section>
    </main>
  );
}
