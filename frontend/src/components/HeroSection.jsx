import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dna, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import DNAAnimation from "@/components/DNAAnimation";
import dnaHero from "@/assets/dna-hero.jpg";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${dnaHero})` }}
      >
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        <DNAAnimation />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Next-Generation Genomics Platform
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight 
               text-blue-900 dark:text-cyan-400"
          >
            Unlock Your{" "}
            <span className="block relative bg-primary text-transparent bg-clip-text text-cyan-600 dark:text-cyan-300">
                Genetic Potential
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-slate-300"
          >
            Advanced genome analysis, AI-powered disease prediction, and
            personalized health insights all in one comprehensive platform.
          </motion.p>

          {/* Buttons with hover animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="px-8 py-3 text-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white 
                     hover:from-teal-700 hover:to-cyan-700 
                     dark:from-teal-400 dark:to-cyan-500 dark:text-slate-900
                     dark:hover:from-teal-300 dark:hover:to-cyan-400"
                asChild
              >
                <Link to="/register">Get Started Free</Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-black dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"
                asChild
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mt-12 text-muted-foreground"
          >
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Shield className="h-4 w-4 text-stone-400" />
              </motion.div>
              <span className="text-sm text-stone-200">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Dna className="h-4 w-4 text-stone-400" />
              </motion.div>
              <span className="text-sm text-stone-200">99.9% Accuracy</span>
            </div>
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Users className="h-4 w-4 text-stone-400" />
              </motion.div>
              <span className="text-sm text-stone-200">
                Trusted by 10k+ Users
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
