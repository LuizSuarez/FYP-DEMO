import Navbar from "../components/NavBar";
import LandingFooter from "../components/Footer";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Upload, Search, Activity, Stethoscope, BarChart3, Heart } from "lucide-react";
import CTASection from "../components/LandingPage/CTASection";
import { Link } from "lucide-react";

const services = [
  {
    title: "Genome File Upload",
    description: "Upload and securely manage genome files (.fasta, .vcf, .gff) with real-time validation.",
    icon: Upload,
  },
  {
    title: "Mutation Detection",
    description: "Identify SNPs, insertions, deletions, and other mutations with detailed reports.",
    icon: Search,
  },
  {
    title: "Disease Risk Prediction",
    description: "ML-powered predictions for diabetes, cardiovascular disease, and genetic disorders.",
    icon: Activity,
  },
  {
    title: "Doctor Connect",
    description: "Securely share results with verified clinicians for consultation and preventive advice.",
    icon: Stethoscope,
  },
  {
    title: "Visualization Dashboard",
    description: "Explore mutations, GC content, and codon usage through interactive charts and graphs.",
    icon: BarChart3,
  },
  {
    title: "Lifestyle Suggestions",
    description: "Receive health recommendations tailored to your genetic risk profile.",
    icon: Heart,
  },
];

const Services = () => {
  return (
    <>
    <div className="bg-slate-200 dark:bg-inherit">
      <Navbar />
    <div className="p-8 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-4xl mb-6 text-cyan-600 dark:text-cyan-400 flex items-center justify-center"
          >
          Our Services
        </motion.h1>
      <section className="mb-8">
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg leading-relaxed mb-4 text-justify"
          >
          DNAlytics offers a wide range of services that transform raw genomic 
          data into meaningful health insights. Our platform is designed for both 
          everyday users and healthcare professionals.
          </motion.p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
            const Icon = service.icon;
            return (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex"
            >
              <Card
                className="card-shadow hover:shadow-xl transition-all duration-500 
                hover:-translate-y-2 hover:rotate-1 transform-gpu group cursor-pointer flex flex-col w-full
                bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-800 
                dark:bg-card/50 dark:from-transparent dark:via-transparent dark:to-transparent"
                >
                <CardHeader className="relative">
                  <div className="w-12 h-12 rounded-lg dna-gradient p-2.5 mb-4 
                                  group-hover:scale-110 group-hover:rotate-12 
                                  transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25">
                    <Icon className="h-full w-full text-white transition-transform duration-300" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 text-stone-200">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base group-hover:text-foreground transition-colors duration-300 text-stone-300 group-hover:text-slate-400">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
        <CTASection h2="Ready to explore your DNA?" button="Upload Your Genome" />
      <LandingFooter />
        </div>
    </>
  );
}

export default Services;