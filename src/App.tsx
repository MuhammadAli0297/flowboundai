import { Nav } from "./components/Nav"
import { Hero } from "./components/Hero"
import { ProductSystem } from "./components/ProductSystem"
import { HowItWorks } from "./components/HowItWorks"
import { WhyUs } from "./components/WhyUs"
import { SapComparison } from "./components/SapComparison"
import { Mission } from "./components/Mission"
import { Cta } from "./components/Cta"
import { Footer } from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-fb-paper">
      <Nav />
      <main>
        <Hero />
        <ProductSystem />
        <HowItWorks />
        <WhyUs />
        <SapComparison />
        <Mission />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}

export default App
