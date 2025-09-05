import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dna } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const benefits = [
  "Upload .fasta, .vcf, and .gff files",
  "Interactive genome visualization",
  "ML-powered disease risk assessment",
  "Personalized health recommendations",
  "Professional medical consultation",
  "Comprehensive reporting system",
];

const BenefitsSection = () => {
  return (
    <section className="pt-24 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Professional-Grade Genomic Analysis
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Our platform combines cutting-edge machine learning with
              clinical-grade accuracy to provide you with actionable insights
              from your genetic data.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300 hover:text-primary group cursor-default"
                >
                  <div
                    className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 
                    group-hover:shadow-md group-hover:shadow-primary/50 transition-all duration-300"
                  ></div>
                  <span className="text-base md:text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                className="mt-8 dna-gradient ripple-btn hover:scale-105 hover:shadow-xl 
                  hover:shadow-primary/25 transition-all duration-300 transform-gpu
                  hover:-translate-y-1"
                size="lg"
                asChild
              >
                <Link to="/register">Start Your Analysis</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div
              className="absolute inset-0 medical-gradient rounded-2xl blur-3xl opacity-20 
              hover:opacity-30 transition-opacity duration-500"
            ></div>
            <Card
              className="relative card-shadow magic-border hover:shadow-2xl 
              hover:-translate-y-1 hover:rotate-1 transition-all duration-500 transform-gpu
              hover:bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-800 
             dark:bg-card/50 dark:from-transparent dark:via-transparent dark:to-transparent group w-full
              bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-800 
             dark:bg-card/50 dark:from-transparent dark:via-transparent dark:to-transparent"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300 text-stone-200">
                  <Dna
                    className="h-5 w-5 text-primary group-hover:rotate-180 group-hover:scale-110 
                    transition-all duration-500"
                  />
                  Sample Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center ">
                  <span
                    className="text-sm text-muted-foreground group-hover:text-foreground 
                    transition-colors duration-300 text-stone-300 group-hover:text-stone-400"
                  >
                    Genetic Risk Score
                  </span>
                  <Badge
                    variant="secondary"
                    className="group-hover:scale-110 transition-transform duration-300"
                  >
                    Low Risk
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden relative">
                  <motion.div
                    className="bg-success h-2 rounded-full w-1/4 relative"
                    whileInView={{ width: '25%' }}
                    whileHover={{ width: '50%' }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"></div>
                  </motion.div>
                </div>

                <div
                  className="text-sm text-muted-foreground group-hover:text-foreground 
                  transition-colors duration-300 text-stone-300 group-hover:text-stone-400"
                >
                  Based on 2,847 genetic variants analyzed
                </div>
              </CardContent>

              {/* Magic particles */}
              <div
                className="absolute top-2 right-8 w-1 h-1 bg-primary rounded-full opacity-0 
                group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute bottom-8 right-4 w-1.5 h-1.5 bg-primary rounded-full opacity-0 
                group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"
                style={{ animationDelay: "1s" }}
              ></div>
            </Card>
          </motion.div>
        </div>
          <div className="border-t border-gray-300 dark:border-gray-700 mt-12 text-center text-gray-600 dark:text-gray-400 text-base">
      </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
