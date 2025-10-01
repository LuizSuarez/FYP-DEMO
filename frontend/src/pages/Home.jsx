import { Layout } from "@/components/Layout";
import HeroSection from "../components/LandingPage/HeroSection";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import BenefitsSection from "../components/LandingPage/BenefitsSection";
import CTASection from "../components/LandingPage/CTASection";
import LandingFooter from "../components/Footer";
import PrivacySection from "../components/LandingPage/PrivacySection";

export default function Landing() {
  return (
    <Layout showSidebar={false}>
        <div className="space-y-0 bg-slate-200 dark:bg-inherit">
          <HeroSection />
          <FeaturesSection />
          <BenefitsSection />
          <PrivacySection />
          <CTASection h2="Ready to explore your Story?" p="Join thousands of users who trust DNAlytics for their genomic analysis and health insights" />
          <LandingFooter />
        </div>
    </Layout>
  );
}
