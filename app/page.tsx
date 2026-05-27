import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedDestinations } from "@/components/landing/featured-destinations"
import { StatsSection } from "@/components/landing/stats-section"
import { AISection } from "@/components/landing/ai-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedDestinations />
      <StatsSection />
      <AISection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
