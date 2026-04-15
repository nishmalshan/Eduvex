import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#1a2fa8] text-white px-6 py-12 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-extrabold tracking-wide mb-3">EDUVEX</h2>
            <p className="text-sm text-blue-200 leading-relaxed max-w-xs">
              We envision a world where anyone, anywhere has the power to transform their lives through learning.
            </p>
          </div>

          {/* Popular Goals */}
          <div>
            <h3 className="font-bold text-base mb-4">Popular goals</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              {["Data Scientist", "Full Stack Web Developer", "Cloud Engineer", "Project Manager", "Game Developer", "All Career Accelerators"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-base mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              {["About us", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Accessibility */}
          <div>
            <h3 className="font-bold text-base mb-4">Legal & Accessibility</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              {["Accessibility statement", "Privacy policy", "Sitemap", "Terms"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-t border-blue-600 pt-8">
          {/* Reach out */}
          <div>
            <h4 className="font-bold text-base mb-1">Reach out to us</h4>
            <p className="text-xs text-blue-200 mb-3">
              Get your questions answered about learning with Eduvex.
            </p>
            <a
              href="mailto:support.eduvex@gmail.com"
              className="flex items-center gap-2 text-xs text-blue-200 hover:text-white transition-colors duration-200"
            >
              <MdOutlineEmail className="text-base" />
              support.eduvex@gmail.com
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: <FaFacebookF />, label: "Facebook" },
              { icon: <FaInstagram />, label: "Instagram" },
              { icon: <FaXTwitter />, label: "X / Twitter" },
              { icon: <FaLinkedinIn />, label: "LinkedIn" },
            ].map(({ icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-base hover:bg-blue-100 transition-colors duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-blue-600 pt-6 text-center text-xs text-blue-300">
          © 2026 Eduvex Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer