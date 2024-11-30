"use client";

import { motion } from "framer-motion";
import { Trophy, Check } from "lucide-react";
import Footer from "@/components/footer";

function About() {
  const team = [
    {
      name: "Nikhil Sahni",
      role: "Full Stack Developer",
      image: "/nikhil.jpeg",
    },
    {
      name: "Harsh Thakur",
      role: "Full Stack Developer",
      image: "/harsh.jpeg",
    },
    {
      name: "Aryan Pandey",
      role: "Full Stack Developer",
      image: "/aryan.jpeg",
    },
    {
      name: "Amit Farswan",
      role: "UI/UX Designer",
      image: "/amit.jpeg",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 text-white py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <motion.img
              src="/our-story.jpg"
              alt="NutriWise"
              className="w-64 h-64 mx-auto mb-6"
            />
            Our Story
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Created during an intense 19-hour hackathon, NutriWise emerged from
            our passion for combining technology with healthy living.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 mb-8">
                We're on a mission to make healthy eating accessible, enjoyable,
                and sustainable for everyone through innovative technology and
                community-driven solutions.
              </p>
              <ul className="space-y-4">
                {[
                  "AI-powered nutrition guidance",
                  "Personalized meal recommendations",
                  "Community recipe sharing",
                  "Smart meal tracking",
                  "User activity tracking and monitoring",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <Check className="text-green-500" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <img
                src="/home.jpg"
                alt="Our Mission"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Meet the Team</h2>
            <p className="text-xl text-gray-600">
              The brilliant minds behind NutriWise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathon Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Born in a Hackathon</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            NutriWise was conceived and built during an intensive 19-hour
            hackathon, where our team came together to create a solution that
            would revolutionize the way people approach nutrition and healthy
            eating.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
