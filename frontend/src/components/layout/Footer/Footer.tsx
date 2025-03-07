import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Import X icon
import logo from "../../../assets/images/scrollbooks_logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <Link to="/" className="flex items-center gap-3 mb-2">
            <img className="w-6 h-6" src={logo} alt="App Logo" />
            <h2 className="text-xl font-bold">ScrollBooks</h2>
          </Link>
          <p className="text-sm text-gray-400">
            Your gateway to endless stories.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a
            href="https://www.facebook.com/"
            aria-label="Facebook"
            className="text-gray-400 hover:text-white text-lg"
          >
            <FaFacebook />
          </a>
          <a
            href="https://x.com/"
            aria-label="X.com"
            className="text-gray-400 hover:text-white text-lg"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://www.instagram.com/"
            aria-label="Instagram"
            className="text-gray-400 hover:text-white text-lg"
          >
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="text-center text-gray-500 text-xs mt-4">
        &copy; {new Date().getFullYear()} ScrollBooks. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
