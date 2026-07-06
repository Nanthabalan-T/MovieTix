<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL;

const loading = ref(true)
const error = ref(null)

const stats = ref({
  totalBookings: 0,
  todayBookings: 0,
  last7DaysBookings: 0,
  totalRevenue: 0
})

const theatres = ref([])
const recentBookings = ref([])

const analyticsDate = ref('')
const seatsAnalytics = ref([])
const analyticsLoading = ref(false)

const getTodayDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const fetchDashboard = async () => {
  loading.value = true
  error.value = null
  analyticsDate.value = getTodayDate()
  try {
    const [statsRes, theatresRes, latestRes] = await Promise.all([
      axios.get(`${API_BASE}/dashboard`),
      axios.get(`${API_BASE}/dashboard/theatres`),
      axios.get(`${API_BASE}/bookings/history?days=7`)
    ])
    stats.value = statsRes.data
    theatres.value = theatresRes.data.data
    recentBookings.value = latestRes.data.data
    await fetchSeatsAnalytics()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
}

const fetchSeatsAnalytics = async () => {
  if (!analyticsDate.value) return
  analyticsLoading.value = true
  try {
    const res = await axios.get(`${API_BASE}/dashboard/seats-analytics`, {
      params: { date: analyticsDate.value }
    })
    seatsAnalytics.value = res.data.data || []
  } catch (err) {
    seatsAnalytics.value = []
  } finally {
    analyticsLoading.value = false
  }
}

const onDateChange = () => {
  fetchSeatsAnalytics()
}

onMounted(fetchDashboard)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (timeStr) => {
  if (!timeStr) return 'N/A'
  return timeStr
}

const showCategoryLabel = (time) => {
  const map = {
    '09:30 AM': 'Morning',
    '01:30 PM': 'Matinee',
    '06:30 PM': 'Evening',
    '09:30 PM': 'Night',
    '09:30:00': 'Morning',
    '13:30:00': 'Matinee',
    '18:30:00': 'Evening',
    '21:30:00': 'Night'
  }
  return map[time] || time
}

const groupedAnalytics = () => {
  const movies = {}
  for (const row of seatsAnalytics.value) {
    if (!movies[row.movie]) {
      movies[row.movie] = { morning: 0, afternoon: 0, evening: 0, night: 0 }
    }
    const cat = showCategoryLabel(row.showTime)
    if (cat === 'Morning') movies[row.movie].morning = row.bookedSeats
    else if (cat === 'Matinee') movies[row.movie].afternoon = row.bookedSeats
    else if (cat === 'Evening') movies[row.movie].evening = row.bookedSeats
    else if (cat === 'Night') movies[row.movie].night = row.bookedSeats
  }
  return movies
}
</script>

<template>
  <div class="dashboard-page">
    <div class="container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">MovieTBsys Admin Overview</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading dashboard...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="fetchDashboard">Retry</button>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card card-total">
            <div class="stat-icon">🎫</div>
            <div class="stat-content">
              <h3 class="stat-label">Total Bookings</h3>
              <p class="stat-value">{{ stats.totalBookings }}</p>
            </div>
          </div>

          <div class="stat-card card-today">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <h3 class="stat-label">Today's Bookings</h3>
              <p class="stat-value">{{ stats.todayBookings }}</p>
            </div>
          </div>

          <div class="stat-card card-week">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3 class="stat-label">Last 7 Days</h3>
              <p class="stat-value">{{ stats.last7DaysBookings }}</p>
            </div>
          </div>

          <div class="stat-card card-revenue">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3 class="stat-label">Total Revenue</h3>
              <p class="stat-value">{{ formatCurrency(stats.totalRevenue) }}</p>
            </div>
          </div>
        </div>

        <!-- Theatre Bookings -->
        <div class="section-card">
          <h2 class="section-title">Theatre-wise Bookings</h2>
          <div class="theatre-grid">
            <div class="theatre-card" v-for="t in theatres" :key="t.theatre">
              <div class="theatre-icon">🎬</div>
              <div class="theatre-info">
                <h3 class="theatre-name">{{ t.theatre }}</h3>
                <p class="theatre-count">{{ t.bookings }} bookings</p>
              </div>
            </div>
            <div v-if="theatres.length === 0" class="no-data">
              No theatre data available
            </div>
          </div>
        </div>

        <!-- Booked Seats Analytics -->
        <div class="section-card">
          <div class="analytics-header">
            <h2 class="section-title">Booked Seats Analytics</h2>
            <div class="date-filter">
              <label class="filter-label">Filter by Date:</label>
              <input
                type="date"
                v-model="analyticsDate"
                class="date-input"
                @change="onDateChange"
              />
            </div>
          </div>

          <div v-if="analyticsLoading" class="analytics-loading">
            <div class="spinner-small"></div>
            <p>Loading analytics...</p>
          </div>

          <div v-else-if="Object.keys(groupedAnalytics()).length > 0" class="analytics-table-container">
            <table class="analytics-table">
              <thead>
                <tr>
                  <th class="movie-col">Movie</th>
                  <th class="show-col">🌅 Morning</th>
                  <th class="show-col">☀️ Matinee</th>
                  <th class="show-col">🌆 Evening</th>
                  <th class="show-col">🌙 Night</th>
                  <th class="total-col">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(counts, movie) in groupedAnalytics()" :key="movie">
                  <td class="movie-name">{{ movie }}</td>
                  <td class="show-count">{{ counts.morning }}</td>
                  <td class="show-count">{{ counts.afternoon }}</td>
                  <td class="show-count">{{ counts.evening }}</td>
                  <td class="show-count">{{ counts.night }}</td>
                  <td class="total-count">{{ counts.morning + counts.afternoon + counts.evening + counts.night }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="no-data">
            No bookings found for {{ formatDate(analyticsDate) }}
          </div>
        </div>

        <!-- Recent Bookings -->
        <div class="section-card">
          <h2 class="section-title">
            Recent Bookings
            <span class="count-badge">{{ recentBookings.length }}</span>
          </h2>

          <div class="table-container" v-if="recentBookings.length > 0">
            <table class="bookings-table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Seat</th>
                  <th>Customer</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in recentBookings" :key="b.booking_id">
                  <td class="movie-name">{{ b.movie_name }}</td>
                  <td>{{ b.theatre_name }}</td>
                  <td>{{ formatDate(b.show_date) }}</td>
                  <td>{{ formatTime(b.show_time) }}</td>
                  <td class="seat">{{ b.seat_number }}</td>
                  <td>
                    <div class="customer-info">
                      <span class="name">{{ b.customer_name }}</span>
                      <span class="phone">{{ b.customer_phone }}</span>
                    </div>
                  </td>
                  <td class="amount">{{ formatCurrency(b.booking_amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="no-data">
            No recent bookings found
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  padding: 40px 0 60px;
}

.page-header {
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 6px;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 15px;
}

/* Loading */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.retry-btn {
  margin-top: 16px;
  background: var(--primary);
  color: white;
  padding: 10px 28px;
  border-radius: 8px;
  font-weight: 600;
  transition: var(--transition);
}

.retry-btn:hover {
  background: var(--primary-hover);
  transform: scale(1.05);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-total { border-left-color: var(--primary); }
.card-today { border-left-color: #2196F3; }
.card-week { border-left-color: #FF9800; }
.card-revenue { border-left-color: var(--green); }

.stat-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 26px;
  font-weight: 800;
}

/* Section Card */
.section-card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.count-badge {
  background: var(--primary);
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

/* Theatre Grid */
.theatre-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.theatre-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: var(--transition);
}

.theatre-card:hover {
  background: rgba(229, 9, 20, 0.08);
  border-color: rgba(229, 9, 20, 0.2);
  transform: translateY(-2px);
}

.theatre-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.theatre-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.theatre-count {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Table */
.table-container {
  overflow-x: auto;
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
}

.bookings-table th,
.bookings-table td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.bookings-table th {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.bookings-table tbody tr {
  transition: var(--transition);
}

.bookings-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.movie-name {
  font-weight: 600;
}

.seat {
  font-weight: 600;
  color: var(--yellow);
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-info .name {
  font-weight: 500;
}

.customer-info .phone {
  font-size: 11px;
  color: var(--text-muted);
}

.amount {
  font-weight: 700;
  color: var(--green);
}

.no-data {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
}

/* Analytics */
.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.analytics-header .section-title {
  margin-bottom: 0;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.date-input {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
}

.date-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.15);
}

.analytics-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  gap: 12px;
}

.spinner-small {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.analytics-loading p {
  color: var(--text-muted);
  font-size: 13px;
}

.analytics-table-container {
  overflow-x: auto;
}

.analytics-table {
  width: 100%;
  border-collapse: collapse;
}

.analytics-table th,
.analytics-table td {
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.analytics-table th {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.movie-col {
  text-align: left !important;
}

.show-col {
  min-width: 100px;
}

.total-col {
  font-weight: 700;
  color: var(--primary);
}

.analytics-table tbody tr {
  transition: var(--transition);
}

.analytics-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.movie-name {
  text-align: left !important;
  font-weight: 600;
}

.show-count {
  font-size: 15px;
  font-weight: 500;
}

.total-count {
  font-size: 16px;
  font-weight: 700;
  color: var(--green);
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .theatre-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .theatre-grid {
    grid-template-columns: 1fr;
  }

  .analytics-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .date-filter {
    width: 100%;
  }

  .date-input {
    flex: 1;
  }
}
</style>
