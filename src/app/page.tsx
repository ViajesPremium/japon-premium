import Footer from '@/layout/footer'
import Hero from '@/layout/hero'
import Navbar from '@/layout/navbar'
import Promise from '@/sections/promise'
import Highlights from '@/sections/highlights'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Promise />
      <Highlights />
      <Footer />
    </main>
  )
}
