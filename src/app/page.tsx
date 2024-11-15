"use client";

import React, { useEffect, useRef } from "react";
import { ChefHat, BookOpen, Utensils, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";
// import Footer from "@/components/footer";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const featuresRef = useRef(null);
  const recipeRef = useRef(null);

  useEffect(() => {
    gsap.from(featuresRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(recipeRef.current, {
      opacity: 0,
      x: -50,
      duration: 1,
      scrollTrigger: {
        trigger: recipeRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Google Fonts Import */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;700&family=Satisfy&display=swap");
      `}</style>

      {/* Hero Section */}
      <header className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/home.jpg"
            alt="Cooking background"
            className="w-1/2 h-1/2 object-cover brightness-50"
          />
        </div>

        {/* Decorative SVG Elements */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <motion.path
            d="M0,0 Q50,20 100,0 V100 H0 Z"
            fill="rgba(255,255,255,0.05)"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,100 Q50,80 100,100 V0 H0 Z"
            fill="rgba(255,255,255,0.05)"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <ChefHat className="w-8 h-8 text-white" />
            <span className="text-white text-xl font-bold font-satisfy">
              Nutriwise
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center space-x-8 text-white"
          >
            <a href="#" className="hover:text-gray-300 transition font-lato">
              Recipes
            </a>
            <a href="#" className="hover:text-gray-300 transition font-lato">
              Categories
            </a>
            <a href="#" className="hover:text-gray-300 transition font-lato">
              About
            </a>
            <a href="#" className="hover:text-gray-300 transition font-lato">
              Contact
            </a>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-5xl leading-tight font-playfair"
            >
              Create, Share & Discover
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2 max-w-5xl leading-tight font-playfair"
            >
              <TypeAnimation
                sequence={[
                  "Culinary Masterpieces",
                  1200,
                  "Flavorful Creations",
                  1200,
                  "Savory Delights",
                  1200,
                  "Tasty Innovations",
                  1200,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl font-lato"
          >
            Join our community of passionate food lovers and share your unique
            recipes with the world
          </motion.p>

          <Link href="/Services">
            <motion.button
              className="group relative inline-flex items-center justify-center px-8 py-4 md:px-8 md:py-5 overflow-hidden font-semibold text-lg border-2 border-gray-300 rounded-full transition-all duration-300 hover:border-transparent hover:text-white transform hover:scale-105 bg-white hover:bg-black font-lato"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-gray-200 opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-black flex items-center transition-colors duration-300 group-hover:text-white">
                Explore our services
              </span>
            </motion.button>
          </Link>
        </div>
      </header>

      {/* Featured Recipe Preview */}
      <section ref={recipeRef} className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-playfair">
              Discover New Flavors Every Day
            </h2>
            <p className="text-gray-600 mb-8 text-lg font-lato">
              From traditional classics to modern fusion, explore recipes that
              will inspire your next culinary adventure.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center space-x-2 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg hover:shadow-xl font-lato"
            >
              <span>Browse Recipes</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1170"
              alt="Featured recipe"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30 rounded-lg"></div>
          </div>
        </div>
      </section>

      <section ref={recipeRef} className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1506748686213-18b74709d7b1?crop=entropy&cs=tinysrgb&fit=max&ixid=MnwzNjg5OXwwfDF8c2VhcmNofDd8fGRlc3NlcnR8ZW58MHx8fHwxNjg4fDJ8MHx8fDE2fHww&ixlib=rb-4.0.3&q=80&w=1170"
              alt="Dessert recipe"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30 rounded-lg"></div>
          </div>
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-playfair">
              Indulge in Exquisite Desserts
            </h2>
            <p className="text-gray-600 mb-8 text-lg font-lato">
              Satisfy your sweet tooth with our handpicked dessert recipes, from
              rich cakes to refreshing ice creams.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center space-x-2 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg hover:shadow-xl font-lato"
            >
              <span>Explore Desserts</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>
      </section>

      <section ref={recipeRef} className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-playfair">
              Healthy & Wholesome Meals
            </h2>
            <p className="text-gray-600 mb-8 text-lg font-lato">
              Enjoy delicious, nutritious recipes that fuel your body and
              support a balanced lifestyle.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center space-x-2 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg hover:shadow-xl font-lato"
            >
              <span>Browse Healthy Recipes</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1511974034566-1ab2b4bb2f0e?crop=entropy&cs=tinysrgb&fit=max&ixid=MnwzNjg5OXwwfDF8c2VhcmNofDV8fGhlYWx0aHklMjBhbmQlMjB3aG9sZXNvbWV8ZW58MHx8fHwxNjg4fDJ8MHx8fDE2fHww&ixlib=rb-4.0.3&q=80&w=1170"
              alt="Healthy recipe"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* <Footer></Footer> */}
    </div>
  );
}

export default Home;