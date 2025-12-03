'use client';

import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, Trash2, Edit, Users, Briefcase, Home, CheckCircle, Clock, X as XIcon, Bell, Eye, EyeOff, Menu } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import Modal from '../components/Modal';
import { propertyApi, bookingApi, projectApi } from '../lib/api';
import { Property, Booking, Project } from '../lib/types';
import { validatePropertyForm, hasFormErrors } from '../lib/validation';

const AdminDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPassword, setShowPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  type AdminNotification = {
    id: string;
    type: 'booking:new' | 'booking:status';
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
    payload?: any;
  };

  const [notif, setNotif] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  
  // Modal states
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyFormData, setPropertyFormData] = useState({
    title: '',
    type: 'Land',
    price: '',
    location: '',
    size: '',
    description: '',
    images: '',
    status: 'Available',
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Project modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    clientName: '',
    description: '',
    completionDate: '',
    gallery: '',
  });

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyApi.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      if (!adminToken) return;
      const data = await bookingApi.getAll(adminToken);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const status = (error as any)?.response?.status;
      if (status === 401 || status === 403) {
        alert('Admin token invalid or missing. Please log in again.');
        handleLogout();
      }
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const data = await projectApi.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Load admin token from localStorage on mount and verify it
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setAdminToken(savedToken);
      // Verify the saved token is still valid
      bookingApi.getAll(savedToken)
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch((error: any) => {
          // Token is invalid, clear it
          localStorage.removeItem('adminToken');
          setAdminToken('');
          
        });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties();
      // Load bookings for dashboard metrics and bookings tab
      fetchBookings();
      // Load projects
      fetchProjects();
    }
  }, [isAuthenticated, activeTab, adminToken]);

  // Live notifications via SSE
  useEffect(() => {
    if (!isAuthenticated || !adminToken) return;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const url = `${base}/notifications/stream?token=${encodeURIComponent(adminToken)}`;
    const es = new EventSource(url);

    const onNewBooking = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data?.booking) {
          setBookings(prev => [data.booking, ...prev]);
          const title = 'New Booking';
          const message = `From ${data.booking.clientName} — ${data.booking.serviceType || 'Consultation'}`;
          setNotifications(prev => [
            {
              id: data.booking._id,
              type: 'booking:new',
              title,
              message,
              createdAt: new Date().toISOString(),
              read: false,
              payload: data.booking,
            },
            ...prev,
          ]);
          setNotif(message);
          setTimeout(() => setNotif(null), 5000);
        }
      } catch {}
    };

    es.addEventListener('booking:new', onNewBooking as any);

    const onStatus = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        const booking = data?.booking;
        if (booking?._id) {
          setBookings(prev => prev.map(b => (b._id === booking._id ? booking : b)));
          const title = 'Booking Status Updated';
          const message = `${booking.clientName}: ${booking.status}`;
          setNotifications(prev => [
            {
              id: `${booking._id}:status:${booking.status}`,
              type: 'booking:status',
              title,
              message,
              createdAt: new Date().toISOString(),
              read: false,
              payload: booking,
            },
            ...prev,
          ]);
          setNotif(message);
          setTimeout(() => setNotif(null), 5000);
        }
      } catch {}
    };

    es.addEventListener('booking:status', onStatus as any);

    es.onerror = () => {
      // Auto-close on error; it will retry by default, but we can close
      // es.close();
    };

    return () => {
      es.removeEventListener('booking:new', onNewBooking as any);
      es.removeEventListener('booking:status', onStatus as any);
      es.close();
    };
  }, [isAuthenticated, adminToken]);

  // Handle delete property
  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await propertyApi.delete(String(id), adminToken);
      setProperties(properties.filter(p => p._id !== String(id)));
      alert('Property deleted successfully');
    } catch (error) {
      alert('Error deleting property. Make sure you have admin access.');
    }
  };

  // Handle add/edit property
  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validatePropertyForm({
      title: propertyFormData.title,
      type: propertyFormData.type,
      price: propertyFormData.price,
      location: propertyFormData.location,
      size: propertyFormData.size,
    });

    if (hasFormErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    const propertyData = {
      ...propertyFormData,
      price: Number(propertyFormData.price),
      images: propertyFormData.images ? propertyFormData.images.split(',').map(img => img.trim()) : [],
    };

    try {
      if (editingProperty) {
        // Update existing property
        await propertyApi.update(editingProperty._id!, propertyData, adminToken);
        alert('Property updated successfully');
      } else {
        // Create new property
        await propertyApi.create(propertyData, adminToken);
        alert('Property created successfully');
      }
      
      setShowPropertyModal(false);
      resetPropertyForm();
      fetchProperties();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving property');
    }
  };

  // Handle edit property
  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setPropertyFormData({
      title: property.title,
      type: property.type,
      price: String(property.price),
      location: property.location,
      size: property.size,
      description: property.description || '',
      images: Array.isArray(property.images) ? property.images.join(', ') : property.image || '',
      status: property.status,
    });
    setShowPropertyModal(true);
  };

  // Reset property form
  const resetPropertyForm = () => {
    setPropertyFormData({
      title: '',
      type: 'Land',
      price: '',
      location: '',
      size: '',
      description: '',
      images: '',
      status: 'Available',
    });
    setEditingProperty(null);
    setFormErrors({});
  };

  // Handle property form input change
  const handlePropertyFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPropertyFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await bookingApi.delete(id, adminToken);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (error) {
      alert('Error deleting booking');
    }
  };

  const handleToggleBookingStatus = async (id: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const updated = await bookingApi.updateStatus(id, nextStatus as 'Pending' | 'Completed', adminToken);
      setBookings(prev => prev.map(b => (b._id === id ? updated : b)));
    } catch (error) {
      alert('Error updating booking status');
    }
  };

  // Project handlers
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectFormData.title || !projectFormData.description) {
      alert('Please fill in required fields (title and description)');
      return;
    }

    const projectData = {
      title: projectFormData.title,
      clientName: projectFormData.clientName,
      description: projectFormData.description,
      completionDate: projectFormData.completionDate || undefined,
      gallery: projectFormData.gallery ? projectFormData.gallery.split(',').map(img => img.trim()) : [],
    };

    try {
      if (editingProject) {
        await projectApi.update(editingProject._id!, projectData, adminToken);
        alert('Project updated successfully');
      } else {
        await projectApi.create(projectData, adminToken);
        alert('Project created successfully');
      }
      
      setShowProjectModal(false);
      resetProjectForm();
      fetchProjects();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving project');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      clientName: project.clientName || project.client || '',
      description: project.description || '',
      completionDate: project.completionDate ? new Date(project.completionDate).toISOString().split('T')[0] : '',
      gallery: Array.isArray(project.gallery) ? project.gallery.join(', ') : project.image || '',
    });
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectApi.delete(id, adminToken);
      setProjects(projects.filter(p => p._id !== id));
      alert('Project deleted successfully');
    } catch (error) {
      alert('Error deleting project. Make sure you have admin access.');
    }
  };

  const resetProjectForm = () => {
    setProjectFormData({
      title: '',
      clientName: '',
      description: '',
      completionDate: '',
      gallery: '',
    });
    setEditingProject(null);
  };

  const handleProjectFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectFormData(prev => ({ ...prev, [name]: value }));
  };

  // Admin login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) {
      alert('Please enter admin token');
      return;
    }

    try {
      // Verify token by making a test API call
      await bookingApi.getAll(adminToken);
      // If successful, save token and authenticate
      localStorage.setItem('adminToken', adminToken);
      setIsAuthenticated(true);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        alert('Invalid admin token. Please check and try again.');
      } else {
        alert('Error verifying token. Please try again.');
      }
      setAdminToken('');
    }
  };

  // Admin logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAdminToken('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
              <Home size={48} className="text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">ZAHB Estates</h1>
            <p className="text-green-300 text-lg">Admin Portal</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-center mb-2 text-slate-900">Welcome Back</h2>
            <p className="text-center text-gray-600 mb-6">Enter your admin credentials to continue</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Token
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                    className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all text-lg text-slate-900 font-medium tracking-wide"
                    placeholder="••••••••••••"
                    required
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                    title={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/30 text-lg"
              >
                Access Dashboard
              </button>
            </form>

            {/* Info Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <div className="p-2 bg-green-50 rounded-lg mt-0.5">
                  <CheckCircle size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Admin Access</p>
                  <p className="text-xs leading-relaxed">
                    Manage properties, bookings, projects, and view real-time notifications from your centralized dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-white/60 text-sm mt-6">
            © 2024 ZAHB Estates. Secure Admin Portal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {notif && (
        <div className="fixed right-4 bottom-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm">
          <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
          <span className="text-sm">{notif}</span>
          <button onClick={() => setNotif(null)} className="ml-2 text-gray-300 hover:text-white flex-shrink-0">
            <XIcon size={14} />
          </button>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-slate-800 text-white p-6 transition-transform duration-300 ease-in-out
        overflow-y-auto
      `}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider">
            Admin Panel
          </h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <XIcon size={20} />
          </button>
        </div>
        <ul className="space-y-3">
          <li
            onClick={() => {
              setActiveTab('dashboard');
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${
              activeTab === 'dashboard'
                ? 'text-green-400 bg-slate-700/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home size={18} /> Dashboard
          </li>
          <li
            onClick={() => {
              setActiveTab('properties');
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${
              activeTab === 'properties'
                ? 'text-green-400 bg-slate-700/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid size={18} /> Properties
          </li>
          <li
            onClick={() => {
              setActiveTab('projects');
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${
              activeTab === 'projects'
                ? 'text-green-400 bg-slate-700/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Briefcase size={18} /> Projects
          </li>
          <li
            onClick={() => {
              setActiveTab('bookings');
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${
              activeTab === 'bookings'
                ? 'text-green-400 bg-slate-700/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users size={18} /> Bookings
            {bookings.length > 0 && (
              <span className="ml-auto bg-green-500 text-slate-900 text-xs font-bold px-2 rounded-full">
                {bookings.length}
              </span>
            )}
          </li>
          <li
            onClick={() => {
              setActiveTab('notifications');
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${
              activeTab === 'notifications'
                ? 'text-green-400 bg-slate-700/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bell size={18} /> Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-auto bg-red-400 text-slate-900 text-xs font-bold px-2 rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </li>
        </ul>
        
        <button
          onClick={handleLogout}
          className="mt-8 w-full py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">Total Properties</h3>
                  <LayoutGrid className="text-green-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-slate-900">{properties.length}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {properties.filter(p => p.status === 'Available').length} available
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">Total Bookings</h3>
                  <Users className="text-blue-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-slate-900">{bookings.length}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {bookings.filter(b => b.status === 'Pending').length} pending
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">Projects</h3>
                  <Briefcase className="text-purple-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
                <p className="text-sm text-gray-500 mt-1">Completed projects</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {properties.slice(0, 5).map(property => (
                  <div key={property._id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                    <img 
                      src={Array.isArray(property.images) && property.images[0] ? property.images[0] : property.image || 'https://via.placeholder.com/100'} 
                      alt={property.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{property.title}</h4>
                      <p className="text-sm text-gray-500">{property.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Manage Properties</h1>
              <button 
                onClick={() => {
                  resetPropertyForm();
                  setShowPropertyModal(true);
                }}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Plus size={18} /> Add Property
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <LayoutGrid size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-4">No properties found</p>
                <button 
                  onClick={() => setShowPropertyModal(true)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Your First Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    isAdmin={true}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 sm:mb-8">Manage Bookings</h1>
            
            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No bookings yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Service</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="border-b hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">{booking.clientName}</p>
                            <p className="text-sm text-gray-500">{booking.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{booking.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{booking.serviceType || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {booking.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              title={booking.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
                              onClick={() => handleToggleBookingStatus(booking._id!, booking.status)}
                              className={`transition-colors ${
                                booking.status === 'Completed' ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'
                              }`}
                            
                            >
                              {booking.status === 'Completed' ? (
                                <Clock size={18} />
                              ) : (
                                <CheckCircle size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(booking._id!)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Delete booking"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Manage Projects</h1>
              <button 
                onClick={() => {
                  resetProjectForm();
                  setShowProjectModal(true);
                }}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Plus size={18} /> Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-4">No projects found</p>
                <button 
                  onClick={() => setShowProjectModal(true)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Your First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {projects.map((project) => (
                  <div key={project._id} className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          Array.isArray(project.gallery) && project.gallery[0] 
                            ? project.gallery[0] 
                            : project.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500'
                        }
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-2 bg-white/90 hover:bg-white rounded-full text-blue-600 hover:text-blue-700 transition-colors"
                          title="Edit project"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project._id!)}
                          className="p-2 bg-white/90 hover:bg-white rounded-full text-red-600 hover:text-red-700 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{project.title}</h3>
                      {(project.clientName || project.client) && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Client:</span> {project.clientName || project.client}
                        </p>
                      )}
                      {(project.completionDate || project.year) && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Completed:</span>{' '}
                          {project.completionDate 
                            ? new Date(project.completionDate).toLocaleDateString() 
                            : project.year
                          }
                        </p>
                      )}
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Notifications</h1>
              {notifications.some(n => !n.read) && (
                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-700 transition-colors text-xs sm:text-sm w-full sm:w-auto"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No notifications yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md divide-y">
                {notifications.map((n) => (
                  <div
                    key={n.id + n.createdAt}
                    className={`flex items-start gap-4 px-6 py-4 ${n.read ? 'bg-white' : 'bg-slate-50'}`}
                    onClick={() => setNotifications(prev => prev.map(x => x === n ? { ...x, read: true } : x))}
                  >
                    <div className="mt-1">
                      {n.type === 'booking:new' ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (
                        <Clock size={18} className="text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800">{n.title}</h4>
                        {!n.read && <span className="text-[10px] uppercase bg-red-100 text-red-600 px-2 rounded">New</span>}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Property Add/Edit Modal */}
      <Modal
        isOpen={showPropertyModal}
        onClose={() => {
          setShowPropertyModal(false);
          resetPropertyForm();
        }}
        title={editingProperty ? 'Edit Property' : 'Add New Property'}
      >
        <form onSubmit={handlePropertySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={propertyFormData.title}
              onChange={handlePropertyFormChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                formErrors.title ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-green-500 outline-none`}
              placeholder="e.g., Green Acres Farm"
            />
            {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={propertyFormData.type}
                onChange={handlePropertyFormChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option>Land</option>
                <option>Farm</option>
                <option>House</option>
                <option>Residential</option>
                <option>Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={propertyFormData.price}
                onChange={handlePropertyFormChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  formErrors.price ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-green-500 outline-none`}
                placeholder="e.g., 4500000"
              />
              {formErrors.price && <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={propertyFormData.location}
                onChange={handlePropertyFormChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  formErrors.location ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-green-500 outline-none`}
                placeholder="e.g., Epe, Lagos"
              />
              {formErrors.location && <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="size"
                value={propertyFormData.size}
                onChange={handlePropertyFormChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  formErrors.size ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-green-500 outline-none`}
                placeholder="e.g., 2 Acres"
              />
              {formErrors.size && <p className="mt-1 text-sm text-red-600">{formErrors.size}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={propertyFormData.status}
              onChange={handlePropertyFormChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option>Available</option>
              <option>Sold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={propertyFormData.description}
              onChange={handlePropertyFormChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none h-24 resize-none"
              placeholder="Property description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs (comma-separated)
            </label>
            <input
              type="text"
              name="images"
              value={propertyFormData.images}
              onChange={handlePropertyFormChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">Enter image URLs separated by commas</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-sm sm:text-base"
            >
              {editingProperty ? 'Update Property' : 'Create Property'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPropertyModal(false);
                resetPropertyForm();
              }}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Project Add/Edit Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          resetProjectForm();
        }}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
      >
        <form onSubmit={handleProjectSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={projectFormData.title}
              onChange={handleProjectFormChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g., Lekki Phase 2 Development"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name
            </label>
            <input
              type="text"
              name="clientName"
              value={projectFormData.clientName}
              onChange={handleProjectFormChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g., ABC Corporation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={projectFormData.description}
              onChange={handleProjectFormChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none h-32 resize-none"
              placeholder="Describe the project..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completion Date
            </label>
            <input
              type="date"
              name="completionDate"
              value={projectFormData.completionDate}
              onChange={handleProjectFormChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Image URLs (comma-separated)
            </label>
            <input
              type="text"
              name="gallery"
              value={projectFormData.gallery}
              onChange={handleProjectFormChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">Enter image URLs separated by commas</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-sm sm:text-base"
            >
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowProjectModal(false);
                resetProjectForm();
              }}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
