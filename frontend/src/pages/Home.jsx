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
          <CTASection h2="Ready to explore your Story?" p="Join thousands of users who trust DNAlytics for their genomic analysis and health insights" />
          <LandingFooter />
        </div>
    </Layout>
  );
}
