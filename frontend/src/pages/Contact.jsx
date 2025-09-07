import Navbar from "../components/NavBar";
import LandingFooter from "../components/Footer";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="bg-slate-200 dark:bg-inherit">
        <div className="p-8 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-4xl mb-6 text-cyan-600 dark:text-cyan-400"
          >
            Contact Us
          </motion.h1>
          <section className="mb-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg leading-relaxed mb-4 text-justify"
            >
              Whether you are an individual curious about your DNA, a healthcare
              professional, or a potential collaborator, we’d love to hear from
              you.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg leading-relaxed text-justify"
            >
              Reach out to our team for queries, collaborations, or technical
              support.
            </motion.p>
          </section>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-6 rounded-2xl shadow space-y-4 border rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg leading-relaxed mb-4 text-justify"
            >
              <strong>Email:</strong>{" "}
              <a href="mailto:support@dnalytics.com" className="text-blue-600">
                support@dnalytics.com
              </a>
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg leading-relaxed mb-4 text-justify"
            >
              <strong>University:</strong> Department of Computer Science, Air
              University Islamabad
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg leading-relaxed mb-4 text-justify"
            >
              <strong>Team Members:</strong> Abdul Moeez, Nayab Hanif, Bushra
              Aziz
            </motion.p>
          </motion.div>

          <section className="mt-10">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="text-4xl mb-6 text-cyan-600 dark:text-cyan-400"
            >
              Get in Touch
            </motion.h2>
            <form className="space-y-4">
              <motion.input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
              <motion.input
                type="email"
                placeholder="Your Email"
                required={true}
                className="w-full p-3 border rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <motion.textarea
                placeholder="Your Message"
                rows="5"
                className="w-full p-3 border rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <motion.button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white 
                     hover:from-teal-700 hover:to-cyan-700 dark:text-black"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Send Message
              </motion.button>
            </form>
          </section>
        </div>
        <LandingFooter />
      </div>
    </>
  );
}
