import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Dna, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingFooter = () => {
  return (
    <footer className="bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 py-20">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
        {/* Logo & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Dna className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">DNAlytics</span>
          </div>
          <p className="text-gray-700 dark:text-gray-400 text-lg">
            Unlock your genetic potential with advanced genome analysis, AI-powered disease prediction, and personalized health insights.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Link to="#" className="hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-lg">Quick Links</h3>
          <ul className="space-y-2 text-base">
            <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
            <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </motion.div>

        {/* Legal Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-lg">Legal</h3>
          <ul className="space-y-2 text-base">
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-lg">Subscribe</h3>
          <p className="text-gray-700 dark:text-gray-400 mb-4 text-base">
            Get updates on new features and exclusive content.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary"
            />
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="px-3 py-2 dna-gradient ripple-btn">
                Subscribe
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-12 pt-6 text-center text-gray-600 dark:text-gray-400 text-base">
        &copy; {new Date().getFullYear()} DNAlytics. All rights reserved.
      </div>
    </footer>
  );
};

export default LandingFooter;
