import React from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black py-8 px-6 relative">

      <div className="container mx-auto text-center">
        <p className="text-xl text-gray-300 mb-4">
          © 2024 Your Company Name
        </p>

        <div className="space-x-6 mb-6">
          <a
            href="/privacy-policy"
            className="text-cyan-400 hover:text-pink-400 hover:border-b-2 border-cyan-400 transition-all duration-300 ease-in-out"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-and-conditions"
            className="text-cyan-400 hover:text-pink-400 hover:border-b-2 border-cyan-400 transition-all duration-300 ease-in-out"
          >
            Terms & Conditions
          </a>
          <a
            href="/contact-us"
            className="text-cyan-400 hover:text-pink-400 hover:border-b-2 border-cyan-400 transition-all duration-300 ease-in-out"
          >
            Contact Us
          </a>
        </div>

        <div className="flex justify-center space-x-8">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-cyan-400 hover:text-pink-400 text-3xl transition-all duration-300 ease-in-out" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-cyan-400 hover:text-pink-400 text-3xl transition-all duration-300 ease-in-out" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-cyan-400 hover:text-pink-400 text-3xl transition-all duration-300 ease-in-out" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;