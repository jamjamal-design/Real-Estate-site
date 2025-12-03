import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- PROPERTY API CALLS ---

export const propertyApi = {
  // Get all properties
  getAll: async () => {
    try {
      const response = await apiClient.get('/properties');
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  // Get single property by ID
  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  // Create new property (Admin only)
  create: async (propertyData: any, adminToken: string) => {
    try {
      const response = await apiClient.post('/properties', propertyData, {
        headers: {
          'x-admin-token': adminToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  // Update property (Admin only)
  update: async (id: string, propertyData: any, adminToken: string) => {
    try {
      const response = await apiClient.put(`/properties/${id}`, propertyData, {
        headers: {
          'x-admin-token': adminToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  // Delete property (Admin only)
  delete: async (id: string, adminToken: string) => {
    try {
      const response = await apiClient.delete(`/properties/${id}`, {
        headers: {
          'x-admin-token': adminToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },
};

// --- BOOKING API CALLS ---

export const bookingApi = {
  // Submit a booking
  create: async (bookingData: {
    clientName: string;
    email: string;
    phone: string;
    serviceType?: string;
    message?: string;
  }) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error submitting booking:', error);
      throw error;
    }
  },

  // Get all bookings (Admin only)
  getAll: async (adminToken: string) => {
    try {
      const response = await apiClient.get('/bookings', {
        headers: {
          'x-admin-token': adminToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Update booking status (Admin only)
  updateStatus: async (id: string, status: 'Pending' | 'Completed', adminToken: string) => {
    try {
      const response = await apiClient.patch(`/bookings/${id}/status`, { status }, {
        headers: { 'x-admin-token': adminToken },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Delete booking (Admin only)
  delete: async (id: string, adminToken: string) => {
    try {
      const response = await apiClient.delete(`/bookings/${id}`, {
        headers: { 'x-admin-token': adminToken },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },
};

// --- PROJECT API CALLS ---

export const projectApi = {
  // Get all projects
  getAll: async () => {
    try {
      const response = await apiClient.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get single project by ID
  getById: async (id: string) => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  // Create new project (Admin only)
  create: async (projectData: any, adminToken: string) => {
    try {
      const response = await apiClient.post('/projects', projectData, {
        headers: {
          'x-admin-token': adminToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project (Admin only)
  update: async (id: string, projectData: any, adminToken: string) => {
    try {
      const response = await apiClient.put(`/projects/${id}`, projectData, {
        headers: {
          'x-admin-token': adminToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project (Admin only)
  delete: async (id: string, adminToken: string) => {
    try {
      const response = await apiClient.delete(`/projects/${id}`, {
        headers: {
          'x-admin-token': adminToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
};

export default apiClient;
