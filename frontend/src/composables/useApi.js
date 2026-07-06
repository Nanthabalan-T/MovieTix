import { ref } from 'vue'
import { bookingAPI, dashboardAPI } from '../services/api'

// Composable for booking operations
export function useBookings() {
  const bookings = ref([])
  const currentBooking = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const source = ref('')

  const fetchAllBookings = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.getAll()
      bookings.value = response.data
      source.value = response.source
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchBookingById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.getById(id)
      currentBooking.value = response.data
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTodayBookings = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.getToday()
      bookings.value = response.data
      source.value = response.source
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchLast3DaysBookings = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.getLast3Days()
      bookings.value = response.data
      source.value = response.source
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchLast7DaysBookings = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.getLast7Days()
      bookings.value = response.data
      source.value = response.source
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (bookingData) => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.create(bookingData)
      bookings.value.push(response.data)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBookingStatus = async (id, status) => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.updateStatus(id, status)
      const index = bookings.value.findIndex(b => b.booking_id === id)
      if (index !== -1) {
        bookings.value[index] = response.data
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    bookings,
    currentBooking,
    loading,
    error,
    source,
    fetchAllBookings,
    fetchBookingById,
    fetchTodayBookings,
    fetchLast3DaysBookings,
    fetchLast7DaysBookings,
    createBooking,
    updateBookingStatus
  }
}

// Composable for dashboard operations
export function useDashboard() {
  const stats = ref(null)
  const summary = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const source = ref('')

  const fetchStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await dashboardAPI.getStats()
      stats.value = response.data
      source.value = response.source
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSummary = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await dashboardAPI.getSummary()
      summary.value = response.data
      source.value = response.source
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    summary,
    loading,
    error,
    source,
    fetchStats,
    fetchSummary
  }
}
