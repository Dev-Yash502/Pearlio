import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ShowcaseSection from "@/components/ShowcaseSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <ShowcaseSection />
        <FeaturesSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}

