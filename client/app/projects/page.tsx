'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Calendar } from 'lucide-react';
import { projectApi } from '../lib/api';

type Project = {
  _id?: string;
  id?: number;
  title: string;
  client: string;
  year: string;
  image: string;
  description?: string;
};

// Mock data for projects (since project routes aren't implemented yet)
const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Lekki Pearl Garden',
    client: 'Private Developer',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=1000',
    description: 'Complete estate development with modern infrastructure and amenities.'
  },
  {
    id: 2,
    title: 'Ogun Farm Restoration',
    client: 'AgroAllied Ltd',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1625246333195-5840507993eb?auto=format&fit=crop&q=80&w=1000',
    description: 'Large-scale farm land clearing and irrigation system installation.'
  },
  {
    id: 3,
    title: 'Ikoyi Residential Complex',
    client: 'Luxury Homes Nigeria',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
    description: 'Premium residential development with state-of-the-art facilities.'
  },
  {
    id: 4,
    title: 'Epe Farmland Development',
    client: 'Green Agriculture Co.',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=1000',
    description: 'Conversion of raw land into productive agricultural space.'
  },
  {
    id: 5,
    title: 'Victoria Island Commercial Hub',
    client: 'Business Properties Ltd',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    description: 'Multi-story commercial building with modern office spaces.'
  },
  {
    id: 6,
    title: 'Ajah Estate Phase 2',
    client: 'Real Estate Ventures',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
    description: 'Affordable housing estate with community facilities.'
  },
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [loading, setLoading] = useState(false);

  // Uncomment this when you have project routes in backend
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await projectApi.getAll();
  //       setProjects(data);
  //     } catch (error) {
  //       console.error('Error fetching projects:', error);
  //       setProjects(MOCK_PROJECTS); // Fallback to mock data
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //
  //   fetchProjects();
  // }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Projects
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A showcase of successful developments and transformations we've delivered for our clients
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Loading projects...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id || project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-green-500 text-white py-16 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8">
            Let's discuss how we can help bring your real estate vision to life
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Project Card Component
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="relative h-80">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center gap-2 text-sm text-green-400 mb-2">
          <Calendar size={16} />
          <span>{project.year}</span>
        </div>
        
        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
        
        <p className="text-gray-300 text-sm mb-1">Client: {project.client}</p>
        
        {project.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        
        <button className="flex items-center gap-2 text-green-400 font-semibold hover:gap-3 transition-all">
          View Details <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProjectsPage;
