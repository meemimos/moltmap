import {
  Hero,
  ValueStrip,
  FeatureGrid,
  HowItWorks,
  DemoPreview,
  AgentsSection,
  UseCases,
  FAQ,
  FinalCTA,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ValueStrip />
      <FeatureGrid />
      <HowItWorks />
      <DemoPreview />
      <AgentsSection />
      <UseCases />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
