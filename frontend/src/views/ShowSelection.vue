<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { theatres } from '../data/theatres'

const API_BASE = 'http://localhost:5005/api'
const route = useRoute()
const router = useRouter()

const movie = ref(null)
const isLoading = ref(true)
const error = ref(null)

const movieId = computed(() => Number(route.params.id))
const theatreName = computed(() => route.query.theatre || '')
const theatre = computed(() => theatres.find(t => t.name === theatreName.value))

const selectedDate = ref(null)

const fetchMovie = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await axios.get(`${API_BASE}/movies/${movieId.value}`)
    movie.value = res.data.data
  } catch (err) {
    error.value = 'Movie not found'
  } finally {
    isLoading.value = false
  }
}

const getNext7Days = () => {
  const days = []
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    days.push({
      date: `${year}-${month}-${day}`,
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()],
      dateLabel: `${date.getDate()} ${monthNames[date.getMonth()]}`,
      isToday: i === 0
    })
  }
  return days
}

const days = getNext7Days()

const showCategories = [
  { key: 'morning', label: 'Morning Show', icon: '🌅', time: '09:30 AM' },
  { key: 'afternoon', label: 'Matinee Show', icon: '☀️', time: '01:30 PM' },
  { key: 'evening', label: 'Evening Show', icon: '🌆', time: '06:30 PM' },
  { key: 'night', label: 'Night Show', icon: '🌙', time: '09:30 PM' }
]

const getTheatreShow = (catKey) => {
  if (!theatre.value) return null
  return theatre.value.shows[catKey]
}

const selectDate = (date) => {
  selectedDate.value = date
}

const selectShow = (catKey) => {
  if (!selectedDate.value || !theatreName.value) return
  const show = getTheatreShow(catKey)
  if (!show) return
  router.push({
    name: 'SeatSelection',
    params: { id: movieId.value },
    query: { theatre: theatreName.value, show: show.time, date: selectedDate.value }
  })
}

onMounted(fetchMovie)
</script>

<template>
  <div class="show-selection-page">
    <div class="container">
      <button class="back-btn" @click="router.back()">← Back</button>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading movie...</p>
      </div>

      <div v-else-if="error || !movie || !theatre" class="not-found">
        <h2>{{ error || 'Theatre not found' }}</h2>
        <router-link to="/movies" class="browse-btn">Browse Movies</router-link>
      </div>

      <div v-else class="show-selection-content">
        <div class="movie-bar">
          <img :src="movie.poster" :alt="movie.title" class="movie-poster" />
          <div class="movie-info">
            <h2 class="movie-title">{{ movie.title }}</h2>
            <div class="movie-meta">
              <span class="meta-tag rating">⭐ {{ movie.rating }}</span>
              <span class="meta-tag genre">{{ movie.genre }}</span>
              <span class="meta-tag duration">{{ movie.duration }}</span>
            </div>
          </div>
          <div class="theatre-badge">
            <span class="theatre-label">📍 {{ theatre.name }}</span>
            <span class="theatre-location">{{ theatre.location }}</span>
          </div>
        </div>

        <div class="section-card">
          <h3 class="section-title">📅 Select Date</h3>
          <div class="date-chips">
            <button
              v-for="day in days"
              :key="day.date"
              class="date-chip"
              :class="{ active: selectedDate === day.date, today: day.isToday }"
              @click="selectDate(day.date)"
            >
              <span class="chip-day">{{ day.dayName }}</span>
              <span class="chip-date">{{ day.dateLabel }}</span>
            </button>
          </div>
        </div>

        <div v-if="selectedDate" class="section-card">
          <h3 class="section-title">🎬 Select Show Time</h3>
          <div class="show-grid">
            <button
              v-for="cat in showCategories"
              :key="cat.key"
              class="show-card"
              @click="selectShow(cat.key)"
            >
              <span class="show-icon">{{ cat.icon }}</span>
              <span class="show-label">{{ cat.label }}</span>
              <span class="show-time">{{ getTheatreShow(cat.key)?.time }}</span>
              <span class="show-price">₹{{ getTheatreShow(cat.key)?.price }}</span>
            </button>
          </div>
        </div>

        <div v-else class="section-card empty-state">
          <p>Please select a date to view available show times</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.show-selection-page {
  padding: 30px 0 60px;
}

.back-btn {
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: var(--transition);
  margin-bottom: 30px;
  display: inline-block;
}

.back-btn:hover {
  background: var(--bg-card-hover);
}

.movie-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--border);
}

.movie-poster {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.movie-info {
  flex: 1;
}

.movie-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.movie-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-tag {
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 600;
}

.rating {
  background: rgba(255, 215, 0, 0.15);
  color: #FFD700;
}

.genre {
  background: rgba(229, 9, 20, 0.15);
  color: var(--primary);
}

.duration {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
}

.theatre-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.theatre-label {
  font-weight: 700;
  font-size: 14px;
}

.theatre-location {
  font-size: 12px;
  color: var(--text-muted);
}

.section-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid var(--border);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
}

.date-chips {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.date-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition);
  min-width: 80px;
}

.date-chip:hover {
  border-color: var(--primary);
  background: rgba(229, 9, 20, 0.1);
}

.date-chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.date-chip.active .chip-day,
.date-chip.active .chip-date {
  color: white;
}

.chip-day {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.chip-date {
  font-size: 16px;
  font-weight: 700;
}

.show-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.show-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
}

.show-card:hover {
  background: var(--primary);
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(229, 9, 20, 0.3);
}

.show-icon {
  font-size: 28px;
}

.show-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.show-card:hover .show-label {
  color: rgba(255, 255, 255, 0.8);
}

.show-time {
  font-size: 16px;
  font-weight: 700;
}

.show-price {
  font-size: 14px;
  color: var(--green);
  font-weight: 600;
}

.show-card:hover .show-price {
  color: white;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
}

.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.browse-btn {
  background: var(--primary);
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  display: inline-block;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .movie-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .theatre-badge {
    align-items: flex-start;
  }

  .date-chips {
    gap: 8px;
  }

  .date-chip {
    padding: 10px 14px;
    min-width: 60px;
  }

  .show-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
