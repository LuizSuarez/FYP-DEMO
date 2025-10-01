import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const PrivacySection = () => {
  return (
    <section className="relative py-12 overflow-hidden bg-slate-200 dark:bg-inherit">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/20 to-purple-400/20 blur-3xl opacity-40 dark:opacity-20" />
      </div>

      <div className="container mx-auto px-6 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-lg"
            >
              <ShieldCheck className="h-10 w-10 text-white" />
            </motion.div>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            Your Privacy Matters
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-24">
            At <span className="font-semibold">DNAlytics</span>, 
            your genomic data is <span className="font-medium">secure, private, and protected</span>. 
            We never share your information without consent, and every analysis is handled with 
            the highest level of confidentiality and encryption.
          </p>
        </motion.div>
      </div>
      <div className="border-t border-gray-300 dark:border-gray-700 mt-12 text-center text-gray-600 dark:text-gray-400 text-base"></div>
    </section>
  );
};

export default PrivacySection;
