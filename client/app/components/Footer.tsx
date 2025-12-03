import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              ZAJHAB<span className="text-green-400"> Estates</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner in real estate investment. We provide verified lands and comprehensive property management services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/properties" className="hover:text-green-400 transition-colors">Buy Land</a></li>
              <li><a href="/projects" className="hover:text-green-400 transition-colors">Our Projects</a></li>
              <li><a href="/about" className="hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-green-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Estate Management</li>
              <li>Land Sales</li>
              <li>Project Development</li>
              <li>Site Inspection</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-green-400" />
                Lagos, Nigeria
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-green-400" />
                +234 803 268 5820, <br /> +234 805 553 4025
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-green-400" />
                info@ZAJHAB ESTATES.com
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ZAJHAB ESTATES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
