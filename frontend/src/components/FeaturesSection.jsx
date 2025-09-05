import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Dna, Brain, Activity, Users, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Dna,
    title: "Genome Analysis",
    description: "Advanced mutation and SNP analysis with real-time processing",
  },
  {
    icon: Brain,
    title: "AI Disease Prediction",
    description:
      "Machine learning powered risk assessment for genetic conditions",
  },
  {
    icon: Activity,
    title: "Lifestyle Tracking",
    description: "Personalized health monitoring and goal tracking",
  },
  {
    icon: Users,
    title: "Doctor Connect",
    description: "Seamless communication with healthcare professionals",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Bank-level encryption for your sensitive genetic data",
  },
  {
    icon: Zap,
    title: "Real-time Results",
    description: "Get insights as soon as your analysis is complete",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-4"
          >
            Comprehensive Genomic Analysis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to understand your genetic data and make
            informed health decisions
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
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
                    <div className="w-12 h-12 rounded-lg dna-gradient p-2.5 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25">
                      <Icon className="h-full w-full text-white group-hover:scale-110 transition-transform duration-300" />
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
      </div>
      <div className="border-t border-gray-300 dark:border-gray-700 mt-12 text-center text-gray-600 dark:text-gray-400 text-base">
      </div>
    </section>
  );
};

export default FeaturesSection;
