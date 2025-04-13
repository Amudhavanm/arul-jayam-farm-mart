
import React from "react";
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ARUL JAYAM MACHINERY</h3>
            <p className="mb-4 text-gray-300">
              Your trusted partner for quality agricultural machinery and equipment.
              Serving farmers across India with the best products and services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={20} className="text-primary shrink-0 mt-1" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={20} className="text-primary shrink-0 mt-1" />
                <span>info@aruljayam.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary shrink-0 mt-1" />
                <span>
                  123 Farm Equipment Road,
                  <br />
                  Chennai, Tamil Nadu, 600001
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Business Hours</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Clock size={20} className="text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Monday - Friday:</p>
                  <p className="text-gray-300">9:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock size={20} className="text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Saturday:</p>
                  <p className="text-gray-300">9:00 AM - 4:00 PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock size={20} className="text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Sunday:</p>
                  <p className="text-gray-300">Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} ARUL JAYAM MACHINERY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
