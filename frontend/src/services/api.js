const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005
/api';

// Generic fetch wrapper with error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Booking API calls
export const bookingAPI = {
  // Get all bookings
  getAll: () => fetchAPI('/bookings'),

  // Get booking by ID
  getById: (id) => fetchAPI(`/bookings/${id}`),

  // Get bookings by date
  getByDate: (date) => fetchAPI(`/bookings/date/${date}`),

  // Get today's bookings
  getToday: () => fetchAPI('/bookings/today'),

  // Get last 3 days bookings
  getLast3Days: () => fetchAPI('/bookings/last-3-days'),

  // Get last 7 days bookings
  getLast7Days: () => fetchAPI('/bookings/last-7-days'),

  // Get booking count by date
  getCountByDate: () => fetchAPI('/bookings/count-by-date'),

  // Create new booking
  create: (bookingData) =>
    fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  // Update booking status
  updateStatus: (id, status) =>
    fetchAPI(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Delete booking
  delete: (id) =>
    fetchAPI(`/bookings/${id}`, {
      method: 'DELETE',
    }),
};

// Dashboard API calls
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: () => fetchAPI('/dashboard'),

  // Get dashboard summary
  getSummary: () => fetchAPI('/dashboard/summary'),
};

// Health check
export const healthAPI = {
  check: () => fetchAPI('/health'),
};

export default { bookingAPI, dashboardAPI, healthAPI };
