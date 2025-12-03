'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PropertyCard from './components/PropertyCard';
import ProjectCard from './components/ProjectCard';
import Loading from './components/Loading';
import { propertyApi } from './lib/api';
import { Property, Project } from './lib/types';
import { Briefcase, MapPin, LayoutGrid } from 'lucide-react';

// Mock projects data
const MOCK_PROJECTS: Project[] = [
  { 
    id: 1, 
    title: 'Lekki Pearl Garden', 
    client: 'Private Developer', 
    year: '2023', 
    image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=1000',
    description: 'Complete estate development with modern infrastructure'
  },
  { 
    id: 2, 
    title: 'Ogun Farm Restoration', 
    client: 'AgroAllied Ltd', 
    year: '2024', 
    image: 'https://images.unsplash.com/photo-1625246333195-5840507993eb?auto=format&fit=crop&q=80&w=1000',
    description: 'Large-scale farm land clearing and irrigation system'
  },
];

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyApi.getAll();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Continue with empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-slate-900 min-h-[600px] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30" 
          />
        </div>
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Build Your Wealth Through <span className="text-green-400">Land</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Secure verified farm lands, residential estates, and premium properties with peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/properties"
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              View Available Lands
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-slate-900 font-bold rounded-lg transition-colors shadow-lg"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Featured Listings</h2>
            <p className="text-gray-600 text-lg">Explore our latest farm lands and estates.</p>
          </div>
          <Link 
            href="/properties"
            className="text-green-600 font-semibold hover:underline hidden sm:block text-lg"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <Loading message="Loading properties..." />
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties available at the moment</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.slice(0, 3).map(p => (
              <PropertyCard key={p._id || p.id} property={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-12 sm:hidden">
          <Link 
            href="/properties"
            className="inline-block px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
          >
            View All Properties
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-slate-800 p-8 rounded-xl hover:bg-slate-700 transition-colors group">
              <div className="bg-green-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Estate Management</h3>
              <p className="text-gray-400 leading-relaxed">
                We manage your properties, ensuring security, maintenance, and value appreciation over time.
              </p>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-xl hover:bg-slate-700 transition-colors group">
              <div className="bg-green-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Land Sales</h3>
              <p className="text-gray-400 leading-relaxed">
                Verified lands free from government acquisition and legal issues, ensuring secure investments.
              </p>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-xl hover:bg-slate-700 transition-colors group">
              <div className="bg-green-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Project Development</h3>
              <p className="text-gray-400 leading-relaxed">
                From clearing forests to building structures, we handle all aspects of property development.
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-xl hover:bg-slate-700 transition-colors group">
              <div className="bg-green-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Farmland Management</h3>
              <p className="text-gray-400 leading-relaxed">
                We manage your Farmland properties, and we specialize in sourcing 100% legitimate farmlands suitable for farming and livestock rearing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Recent Projects</h2>
            <p className="text-gray-600 text-lg">
              A showcase of our successful developments and transformations
            </p>
          </div>
          <Link 
            href="/projects"
            className="text-green-600 font-semibold hover:underline hidden sm:block text-lg"
          >
            View All Projects →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {MOCK_PROJECTS.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center mt-12 sm:hidden">
          <Link 
            href="/projects"
            className="inline-block px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Invest in Your Future?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-green-50">
            Let's help you find the perfect property or manage your real estate portfolio
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/contact"
              className="px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Schedule Consultation
            </Link>
            <Link 
              href="/properties"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-gray-600 text-lg">Properties Sold</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">1000+</div>
              <p className="text-gray-600 text-lg">Happy Clients</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">50+</div>
              <p className="text-gray-600 text-lg">Projects Completed</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">10+</div>
              <p className="text-gray-600 text-lg">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* {About us section} */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000" 
              alt="About Us" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">About ZAJHAB Estates</h2>
            <p className="text-gray-700 text-lg mb-4">
              At ZAJHAB Estates, we are committed to transforming the real estate landscape by providing secure, verified properties that empower our clients to build lasting wealth. With over a decade of experience, our team of experts specializes in land sales, estate management, buying farm lands or farm management and project development across Nigeria.
            </p>
            <p className="text-gray-700 text-lg">
              Our mission is to deliver exceptional value through transparency, integrity, and personalized service. Whether you're looking to invest in farm lands, residential estates, or commercial properties, ZAJHAB Estates is your trusted partner every step of the way.   
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
