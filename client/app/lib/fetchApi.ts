// Fetch-based API calls (alternative to axios)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// --- PROPERTY API CALLS ---

export const propertyFetch = {
  // Get all properties
  getAll: async () => {
    return fetchAPI('/properties');
  },

  // Get single property by ID
  getById: async (id: string) => {
    return fetchAPI(`/properties/${id}`);
  },

  // Create new property (Admin only)
  create: async (propertyData: any, adminToken: string) => {
    return fetchAPI('/properties', {
      method: 'POST',
      headers: {
        'x-admin-token': adminToken,
      },
      body: JSON.stringify(propertyData),
    });
  },

  // Update property (Admin only)
  update: async (id: string, propertyData: any, adminToken: string) => {
    return fetchAPI(`/properties/${id}`, {
      method: 'PUT',
      headers: {
        'x-admin-token': adminToken,
      },
      body: JSON.stringify(propertyData),
    });
  },

  // Delete property (Admin only)
  delete: async (id: string, adminToken: string) => {
    return fetchAPI(`/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-token': adminToken,
      },
    });
  },
};

// --- BOOKING API CALLS ---

export const bookingFetch = {
  // Submit a booking
  create: async (bookingData: {
    clientName: string;
    email: string;
    phone: string;
    serviceType?: string;
    message?: string;
  }) => {
    return fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Get all bookings (Admin only)
  getAll: async (adminToken: string) => {
    return fetchAPI('/bookings', {
      headers: {
        'x-admin-token': adminToken,
      },
    });
  },
};

// --- PROJECT API CALLS ---

export const projectFetch = {
  getAll: async () => {
    return fetchAPI('/projects');
  },
};
