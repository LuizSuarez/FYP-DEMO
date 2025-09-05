import { Layout } from "@/components/Layout";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import BenefitsSection from "../components/BenefitsSection";
import CTASection from "../components/CTASection";
import LandingFooter from "../components/Footer";

export default function Landing() {
  return (
    <Layout showSidebar={false}>
        <div className="space-y-0 bg-slate-200 dark:bg-inherit">
          <HeroSection />
          <FeaturesSection />
          <BenefitsSection />
          <CTASection />
          <LandingFooter />
        </div>
    </Layout>
  );
}
