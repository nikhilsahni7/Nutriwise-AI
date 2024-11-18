import React from "react";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Mission", href: "/mission" },
    { name: "Team", href: "/team" },
    { name: "Careers", href: "/careers" },
  ];

  const productLinks = [
    { name: "NutriWise AI", href: "/app/chat" },
    { name: "Recommendations", href: "/app/recommend" },
    { name: "Tracker", href: "/app/track" },
    { name: "Community", href: "/app/community" },
  ];

  const resourceLinks = [
    { name: "Blog", href: "/blog" },
    { name: "Support", href: "/support" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faqs" },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://instagram.com/nutriwise",
      label: "Instagram",
    },
    { icon: Twitter, href: "https://twitter.com/nutriwise", label: "Twitter" },
    {
      icon: Facebook,
      href: "https://facebook.com/nutriwise",
      label: "Facebook",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/nutriwise",
      label: "LinkedIn",
    },
    { icon: Youtube, href: "https://youtube.com/nutriwise", label: "YouTube" },
  ];

  const contactInfo = [
    { icon: Mail, text: "contact@nutriwise.com" },
    { icon: Phone, text: "+1 (555) 123-4567" },
    { icon: MapPin, text: "123 Wellness Ave, Health City, HC 12345" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h2 className="text-white text-xl font-bold mb-4">NutriWise</h2>
            <p className="text-gray-400 mb-4">
              Empowering healthier lifestyles through AI-powered nutrition
              guidance and community support.
            </p>
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-white flex items-center group"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-white flex items-center group"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-white flex items-center group"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="max-w-md">
            <h3 className="text-white text-lg font-semibold mb-4">
              Subscribe to our newsletter
            </h3>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              © {currentYear} NutriWise. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
