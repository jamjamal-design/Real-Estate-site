'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, MapPin, Phone, Mail, Menu, X, 
  LayoutGrid, Plus, Trash2, Edit, CheckCircle,
  Briefcase, Users, ArrowRight
} from 'lucide-react';

// --- TYPES ---
type Property = {
  id: number;
  title: string;
  type: string;
  price: string;
  location: string;
  size: string;
  status: string;
  image: string;
};

type Project = {
  id: number;
  title: string;
  client: string;
  year: string;
  image: string;
};

// --- MOCK DATA (Simulating your MongoDB) ---
const INITIAL_PROPERTIES: Property[] = [
  { id: 1, title: 'Green Acres Farm', type: 'Farm Land', price: '₦4,500,000', location: 'Epe, Lagos', size: '2 Acres', status: 'Available', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000' },
  { id: 2, title: 'Sunset Estate Plot', type: 'Residential', price: '₦12,000,000', location: 'Ibeju-Lekki', size: '600 sqm', status: 'Available', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000' },
  { id: 3, title: 'Commercial Hub', type: 'Commercial', price: '₦25,000,000', location: 'Ikeja, Lagos', size: '1000 sqm', status: 'Sold', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: 1, title: 'Lekki Pearl Garden', client: 'Private Developer', year: '2023', image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=1000' },
  { id: 2, title: 'Ogun Farm Restoration', client: 'AgroAllied Ltd', year: '2024', image: 'https://images.unsplash.com/photo-1625246333195-5840507993eb?auto=format&fit=crop&q=80&w=1000' },
];

// --- COMPONENTS ---

type NavbarProps = {
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
  toggleAdmin: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ view, setView, toggleAdmin }) => (
  <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-green-500 p-1.5 rounded-lg">
            <Home size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">LandMark<span className="text-green-400">Estates</span></span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <button onClick={() => setView('home')} className={`hover:text-green-400 ${view === 'home' ? 'text-green-400' : ''}`}>Home</button>
          <button onClick={() => setView('properties')} className={`hover:text-green-400 ${view === 'properties' ? 'text-green-400' : ''}`}>Buy Land</button>
          <button onClick={() => setView('projects')} className={`hover:text-green-400 ${view === 'projects' ? 'text-green-400' : ''}`}>Projects</button>
          <button onClick={() => setView('contact')} className={`hover:text-green-400 ${view === 'contact' ? 'text-green-400' : ''}`}>Book Us</button>
        </div>

        <button 
          onClick={toggleAdmin}
          className="px-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-colors"
        >
          {view === 'admin' ? 'Exit Admin' : 'Admin Login'}
        </button>
      </div>
    </div>
  </nav>
);

type HeroProps = {
  setView: React.Dispatch<React.SetStateAction<string>>;
};

const Hero: React.FC<HeroProps> = ({ setView }) => (
  <div className="relative bg-slate-900 h-[500px] flex items-center justify-center text-center px-4">
    <div className="absolute inset-0 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover opacity-30" />
    </div>
    <div className="relative z-10 max-w-3xl">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Build Your Wealth Through <span className="text-green-400">Land</span></h1>
      <p className="text-xl text-gray-300 mb-8">Secure generic farm lands, residential estates, and premium properties with peace of mind.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={() => setView('properties')} className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-transform transform hover:scale-105">
          View Available Lands
        </button>
        <button onClick={() => setView('contact')} className="px-8 py-3 bg-white hover:bg-gray-100 text-slate-900 font-bold rounded-lg">
          Book Consultation
        </button>
      </div>
    </div>
  </div>
);

type PropertyCardProps = {
  property: Property;
  isAdmin: boolean;
  onDelete?: (id: number) => void;
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isAdmin, onDelete }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
    <div className="relative h-48 overflow-hidden">
      <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${property.status === 'Available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
        {property.status}
      </span>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-800">{property.title}</h3>
        <p className="text-green-600 font-bold">{property.price}</p>
      </div>
      <div className="flex items-center text-gray-500 text-sm mb-4">
        <MapPin size={16} className="mr-1" />
        {property.location}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
        <span>{property.type}</span>
        <span className="font-semibold">{property.size}</span>
      </div>
      
      {isAdmin ? (
        <div className="mt-4 flex gap-2">
          <button className="flex-1 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 flex items-center justify-center gap-2">
            <Edit size={16} /> Edit
          </button>
          <button onClick={() => onDelete?.(property.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center justify-center gap-2">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      ) : (
        <button className="w-full mt-4 py-2 border-2 border-slate-900 text-slate-900 font-semibold rounded hover:bg-slate-900 hover:text-white transition-colors">
          View Details
        </button>
      )}
    </div>
  </div>
);

type ProjectCardProps = {
  project: Project;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <div className="group relative overflow-hidden rounded-xl">
    <img src={project.image} alt={project.title} className="w-full h-80 object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
      <h3 className="text-xl font-bold mb-1">{project.title}</h3>
      <p className="text-gray-300 text-sm mb-2">Client: {project.client}</p>
      <div className="flex items-center text-green-400 text-sm font-semibold">
        See Case Study <ArrowRight size={16} className="ml-2" />
      </div>
    </div>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [view, setView] = useState('home'); // home, properties, projects, contact, admin
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  // Admin Toggle Logic
  const toggleAdmin = () => {
    if (view === 'admin') setView('home');
    else setView('admin');
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar view={view} setView={setView} toggleAdmin={toggleAdmin} />

      {/* --- HOME VIEW --- */}
      {view === 'home' && (
        <>
          <Hero setView={setView} />
          
          <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Featured Listings</h2>
                <p className="text-gray-500 mt-2">Explore our latest farm lands and estates.</p>
              </div>
              <button onClick={() => setView('properties')} className="text-green-600 font-semibold hover:underline hidden sm:block">View All</button>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {properties.slice(0, 3).map(p => (
                <PropertyCard key={p.id} property={p} isAdmin={false} onDelete={() => {}} />
              ))}
            </div>
          </section>

          <section className="bg-slate-900 py-16 text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-12">Our Services</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                  <Briefcase className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Estate Management</h3>
                  <p className="text-gray-400">We manage your properties, ensuring security, maintenance, and value appreciation.</p>
                </div>
                <div className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                  <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Land Sales</h3>
                  <p className="text-gray-400">Verified lands free from government acquisition and legal issues.</p>
                </div>
                <div className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                  <LayoutGrid className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Project Development</h3>
                  <p className="text-gray-400">From clearing forests to building structures, we handle the hard work.</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* --- PROPERTIES VIEW --- */}
      {view === 'properties' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">All Properties</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} isAdmin={false} onDelete={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* --- PROJECTS VIEW --- */}
      {view === 'projects' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-4">Our Projects</h2>
          <p className="text-gray-600 max-w-2xl mb-12">A showcase of the work we have delivered for our clients, ranging from farm preparations to full estate construction.</p>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      {/* --- CONTACT/BOOKING VIEW --- */}
      {view === 'contact' && (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Book Our Services</h2>
            <p className="text-center text-gray-500 mb-8">Fill the form below to schedule a site inspection or inquire about a property.</p>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("In a real app, this sends data to your Express backend!"); }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="+234..." required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none">
                  <option>Buy Land</option>
                  <option>Book Site Inspection</option>
                  <option>Project Consultation</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none h-32" placeholder="Tell us more about what you need..."></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:-translate-y-1">
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- ADMIN DASHBOARD VIEW --- */}
      {view === 'admin' && (
        <div className="flex h-[calc(100vh-64px)]">
          {/* Sidebar */}
          <div className="w-64 bg-slate-800 text-white hidden md:block p-6">
            <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-6">Admin Panel</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-green-400 bg-slate-700/50 p-3 rounded cursor-pointer">
                <LayoutGrid size={18} /> Properties
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white p-3 rounded cursor-pointer">
                <Briefcase size={18} /> Projects
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white p-3 rounded cursor-pointer">
                <Users size={18} /> Bookings <span className="ml-auto bg-green-500 text-slate-900 text-xs font-bold px-2 rounded-full">3</span>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-8 bg-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-800">Manage Properties</h1>
              <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-700">
                <Plus size={18} /> Add Property
              </button>
            </div>

            <div className="grid gap-6">
              {properties.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                  <img src={p.image} alt="" className="w-16 h-16 rounded object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{p.title}</h4>
                    <p className="text-sm text-gray-500">{p.location} • {p.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;