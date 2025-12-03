'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <Home size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              ZAHB <span className="text-green-400">Estates</span>
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-green-400 transition-colors">
              Home
            </Link>
            <Link href="/properties" className="hover:text-green-400 transition-colors">
              Buy Land
            </Link>
            <Link href="/projects" className="hover:text-green-400 transition-colors">
              Projects
            </Link>
            <Link href="/contact" className="hover:text-green-400 transition-colors">
              Contact
            </Link>
            
            
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="px-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-colors"
            >
              Admin Login
            </Link>
            
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/" className="block hover:text-green-400 transition-colors">
              Home
            </Link>
            <Link href="/properties" className="block hover:text-green-400 transition-colors">
              Buy Land
            </Link>
            <Link href="/projects" className="block hover:text-green-400 transition-colors">
              Projects
            </Link>
            <Link href="/contact" className="block hover:text-green-400 transition-colors">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
