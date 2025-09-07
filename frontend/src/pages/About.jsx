import Navbar from "../components/NavBar";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { AlertTriangle, Globe, Dna, HeartPulse } from "lucide-react";
import LandingFooter from "../components/Footer";

const reasons = [
  {
    title: "Lack of Localized Tools",
    description:
      "Pakistan and similar regions lack localized, user-friendly genome analysis platforms.",
    icon: Globe,
  },
  {
    title: "Complex Global Tools",
    description:
      "Existing global tools are too complex, fragmented, or not tailored for clinical use.",
    icon: AlertTriangle,
  },
  {
    title: "High Genetic Disorder Prevalence",
    description:
      "There is a high prevalence of genetic disorders in Pakistan due to consanguinity.",
    icon: Dna,
  },
  {
    title: "Our Mission",
    description:
      "We aim to bridge the gap between raw genomic data and preventive healthcare.",
    icon: HeartPulse,
  },
];

const About = () => {
  return (
    <>
      <Navbar />
      <div className="bg-slate-200 dark:bg-inherit">
      <div className="p-8 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-4xl mb-6 text-cyan-600 dark:text-cyan-400 flex items-center justify-center"
        >
          About DNAlytics
        </motion.h1>

        <section className="mb-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg leading-relaxed mb-4 text-justify"
          >
            DNAlytics is a next-generation platform for smart genome data
            analysis and disease risk prediction. Built with cutting-edge
            machine learning and a focus on accessibility, DNAlytics helps
            individuals and clinicians understand complex genetic information in
            a simple and actionable way.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-4xl mb-6 text-cyan-600 dark:text-cyan-400 flex items-center justify-center"
            >
            Our Mission
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg leading-relaxed mb-4 text-justify"
            >
            Our mission is to empower people with insights into their DNA while
            ensuring ethical compliance, data privacy, and user-friendly design.
            We believe genomic data should not be locked behind technical
            barriers or inaccessible systems. It should drive preventive care
            and better health outcomes.
          </motion.p>
        </section>

        <section className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-4xl mb-8 text-cyan-600 dark:text-cyan-400 flex items-center justify-center"
            >
            Why We Built DNAlytics
          </motion.h1>
          <div className="grid md:grid-cols-2 gap-6">
            {reasons.map((feature, index) => {
              const Icon = feature.icon;
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
                      <div
                        className="w-12 h-12 rounded-lg dna-gradient p-2.5 mb-4 
                        group-hover:scale-110 group-hover:rotate-12 
                        transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25"
                      >
                        <Icon className="h-full w-full text-white transition-transform duration-300" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 text-stone-200">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <CardDescription className="text-base group-hover:text-foreground transition-colors duration-300 text-stone-300 group-hover:text-slate-400">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-4xl mb-6 text-cyan-600 dark:text-cyan-400 flex items-center justify-center"
            >
            Our Vision
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg leading-relaxed mb-4 text-justify"
            >
            To become Pakistan’s first comprehensive genomic analysis platform
            that empowers individuals, doctors, and researchers to collaborate,
            predict disease risks, and promote healthier communities through
            preventive care.
          </motion.p>
        </section>
      </div>
      <LandingFooter />
            </div>
    </>
  );
};

export default About;
