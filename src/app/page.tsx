"use client";

import React from "react";
import { ChefHat, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";
import { useInView } from "react-intersection-observer";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const router = useRouter();

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [heroRef] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const heroImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070";
  const dessertImage = "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=2070";
  const healthyImage = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2070";

  const sections = [
    {
      title: "Discover Culinary Excellence",
      description: "Explore a world of flavors crafted by master chefs and home cooks alike.",
      image: heroImage,
      reverse: false,
    },
    {
      title: "Sweet Sensations",
      description: "Indulge in decadent desserts that transform moments into memories.",
      image: dessertImage,
      reverse: true,
    },
    {
      title: "Mindful Eating",
      description: "Nourish your body with wholesome recipes that celebrate health and taste.",
      image: healthyImage,
      reverse: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;700&family=Satisfy&display=swap');
      `}</style>

      {/* Hero Section */}
      <header ref={heroRef} className="relative h-screen">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={heroImage}
            alt="Culinary masterpiece"
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </motion.div>

        {/* Navigation */}
        <motion.nav
          className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <ChefHat className="w-8 h-8 text-white" />
            <span className="text-white text-xl font-bold font-satisfy">
              Nutriwise
            </span>
          </motion.div>
          <div className="hidden md:flex items-center space-x-8">
            {["Recipes", "Categories", "About", "Contact"].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="text-white hover:text-gray-300 transition font-lato relative group"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>
        </motion.nav>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
          style={{ y: y1, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 font-playfair leading-tight">
              Create, Share & Track
            </h1>
            <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <TypeAnimation
                sequence={[
                  "Culinary Masterpieces",
                  2000,
                  "Gourmet Experiences",
                  2000,
                  "Flavor Adventures",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                className="font-playfair"
                repeat={Infinity}
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl font-lato"
          >
            Embark on a culinary journey where every recipe tells a story and every dish is a masterpiece.
          </motion.p>

          <Link href="/auth/signin">
            <motion.button
              className="group relative inline-flex items-center justify-center px-8 py-4 md:px-8 md:py-5 overflow-hidden font-semibold text-lg border-2 border-gray-300 rounded-full transition-all duration-300 hover:border-transparent hover:text-white transform hover:scale-105 bg-white hover:bg-black font-lato"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span  className="relative cursor-pointer text-black flex items-center transition-colors duration-300 group-hover:text-white">
                Get Started
              </span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </motion.div>
      </header>

      {/* Featured Sections */}
      {sections.map((section, index) => (
        <motion.section
          key={index}
          className={`py-24 px-6 lg:px-12 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
        >
          <div
            className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${
              section.reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight font-playfair">
                {section.title}
              </h2>
              <p className="text-gray-600 mb-10 text-xl font-lato">{section.description}</p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:bg-gray-800"
              >
                <span>Explore More</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-[600px] object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </motion.section>
      ))}

      <Footer />
    </div>
  );
}

export default Home;
