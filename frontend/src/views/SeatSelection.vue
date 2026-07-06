<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { theatres } from '../data/theatres'

const API_BASE = import.meta.env.VITE_API_URL;
const route = useRoute()
const router = useRouter()

const movie = ref(null)
const isLoadingMovie = ref(true)

const movieId = computed(() => Number(route.params.id || route.params.movieId))

const fetchMovie = async () => {
  isLoadingMovie.value = true
  try {
    const res = await axios.get(`${API_BASE}/movies/${movieId.value}`)
    movie.value = res.data.data
  } catch (err) {
    movie.value = null
  } finally {
    isLoadingMovie.value = false
  }
}

const SHOW_TIME_MAP = {
  morning: '09:30 AM',
  afternoon: '01:30 PM',
  evening: '06:30 PM',
  night: '09:30 PM'
}

const resolveShowTime = () => {
  if (route.query.show) return route.query.show
  if (route.params.showTime) return SHOW_TIME_MAP[route.params.showTime] || route.params.showTime
  return null
}

const resolveTheatreName = () => {
  if (route.query.theatre) return route.query.theatre
  if (route.params.theatreId) {
    const t = theatres.find(t => t.id === Number(route.params.theatreId))
    return t ? t.name : null
  }
  return null
}

const showTime = computed(() => resolveShowTime())
const theatreName = computed(() => resolveTheatreName())

const getTodayDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const showDate = computed(() => route.query.date || getTodayDate())

const SHOW_KEY_MAP = {
  '09:30 AM': 'morning',
  '01:30 PM': 'afternoon',
  '06:30 PM': 'evening',
  '09:30 PM': 'night'
}

const ticketPrice = computed(() => {
  if (!theatreName.value || !showTime.value) return 200
  const theatre = theatres.find(t => t.name === theatreName.value)
  if (!theatre) return 200
  const showKey = SHOW_KEY_MAP[showTime.value]
  if (showKey && theatre.shows[showKey]) return theatre.shows[showKey].price
  return 200
})
const bookingFee = 20
const totalPrice = computed(() => ticketPrice.value + bookingFee)

const selectedSeat = ref(null)
const bookedSeats = ref([])
const isLoadingSeats = ref(true)
const seatError = ref('')

const rows = ['A', 'B', 'C']

const fetchBookedSeats = async () => {
  if (!movie.value) return
  isLoadingSeats.value = true
  seatError.value = ''
  try {
    const response = await axios.get(`${API_BASE}/bookings/seats`, {
      params: {
        movie_name: movie.value.title,
        theatre_name: theatreName.value,
        show_date: showDate.value,
        show_time: showTime.value
      }
    })
    if (response.data.success) {
      bookedSeats.value = response.data.data
    }
  } catch (error) {
    seatError.value = 'Unable to load seat availability. Showing all seats as available.'
    bookedSeats.value = []
  } finally {
    isLoadingSeats.value = false
  }
}

onMounted(async () => {
  await fetchMovie()
  fetchBookedSeats()
})

const getSeatStatus = (seatId) => {
  if (bookedSeats.value.includes(seatId)) return 'booked'
  if (selectedSeat.value === seatId) return 'selected'
  return 'available'
}

const selectSeat = (seatId) => {
  if (bookedSeats.value.includes(seatId)) return
  if (selectedSeat.value === seatId) {
    selectedSeat.value = null
  } else {
    selectedSeat.value = seatId
  }
}

const proceedToBooking = () => {
  if (!selectedSeat.value || !showTime.value || !theatreName.value) return
  const bookingData = {
    movie: movie.value,
    theatre: theatreName.value,
    showTime: showTime.value,
    showDate: showDate.value,
    seat: selectedSeat.value,
    ticketPrice: ticketPrice.value,
    bookingFee,
    total: totalPrice.value
  }
  sessionStorage.setItem('bookingData', JSON.stringify(bookingData))
  router.push({ name: 'BookingSummary' })
}
</script>

<template>
  <div class="seat-selection-page">
    <div class="container">
      <button class="back-btn" @click="router.back()">← Back</button>

      <div v-if="movie && theatreName && showTime" class="seat-layout">
        <div class="seat-section">
          <div class="screen-container">
            <div class="screen">
              <span class="screen-text">SCREEN</span>
            </div>
            <div class="screen-glow"></div>
          </div>

          <div v-if="isLoadingSeats" class="loading-seats">
            <div class="loading-spinner"></div>
            <p>Loading seat availability...</p>
          </div>

          <div v-if="seatError" class="seat-error">
            <span>{{ seatError }}</span>
          </div>

          <div class="seat-grid">
            <div v-for="row in rows" :key="row" class="seat-row">
              <span class="row-label">{{ row }}</span>
              <div class="row-seats">
                <button
                  v-for="i in 5"
                  :key="`${row}${i}`"
                  class="seat-btn"
                  :class="getSeatStatus(`${row}${i}`)"
                  :disabled="getSeatStatus(`${row}${i}`) === 'booked'"
                  @click="selectSeat(`${row}${i}`)"
                >
                  {{ row }}{{ i }}
                </button>
              </div>
            </div>
          </div>

          <div class="legend">
            <div class="legend-item">
              <span class="legend-box available"></span>
              <span>Available</span>
            </div>
            <div class="legend-item">
              <span class="legend-box selected"></span>
              <span>Selected</span>
            </div>
            <div class="legend-item">
              <span class="legend-box booked"></span>
              <span>Booked</span>
            </div>
          </div>
        </div>

        <div class="summary-section">
          <div class="summary-card">
            <h3 class="summary-title">Booking Summary</h3>

            <div class="summary-details">
              <div class="summary-row">
                <span class="summary-label">Movie</span>
                <span class="summary-value">{{ movie?.title }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Theatre</span>
                <span class="summary-value">{{ theatreName }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Show Time</span>
                <span class="summary-value">{{ showTime }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Show Date</span>
                <span class="summary-value">{{ showDate }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Selected Seat</span>
                <span class="summary-value seat-highlight" :class="{ 'no-seat': !selectedSeat }">
                  {{ selectedSeat || 'None' }}
                </span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="price-breakdown">
              <div class="price-row">
                <span class="price-label">Ticket Price</span>
                <span class="price-value">₹{{ ticketPrice }}</span>
              </div>
              <div class="price-row">
                <span class="price-label">Booking Fee</span>
                <span class="price-value">₹{{ bookingFee }}</span>
              </div>
              <div class="price-row total">
                <span class="price-label">Total Amount</span>
                <span class="price-value total-value">₹{{ totalPrice }}</span>
              </div>
            </div>

            <button
              class="proceed-btn"
              :disabled="!selectedSeat"
              @click="proceedToBooking"
            >
              Proceed to Booking
            </button>
          </div>
        </div>
      </div>

      <div v-else class="not-found">
        <h2>Show details not found</h2>
        <p>Please select a movie, theatre, date, and show time to continue.</p>
        <router-link to="/movies" class="browse-btn">Browse Movies</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seat-selection-page {
  padding: 30px 0 60px;
}

.back-btn {
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: var(--transition);
  margin-bottom: 24px;
  display: inline-block;
}

.back-btn:hover {
  background: var(--bg-card-hover);
}

.seat-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 30px;
  align-items: start;
}

.seat-section {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 30px;
}

.screen-container {
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.screen {
  background: linear-gradient(180deg, rgba(229, 9, 20, 0.2) 0%, rgba(229, 9, 20, 0.05) 100%);
  border: 1px solid var(--primary);
  border-radius: 8px 8px 50% 50%;
  padding: 14px 0;
  position: relative;
}

.screen-text {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--primary);
}

.screen-glow {
  position: absolute;
  bottom: -10px;
  left: 10%;
  right: 10%;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(229, 9, 20, 0.3) 0%, transparent 70%);
  filter: blur(8px);
}

.seat-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.loading-seats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
}

.loading-spinner {
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

.loading-seats p {
  color: var(--text-muted);
  font-size: 14px;
}

.seat-error {
  text-align: center;
  padding: 12px 16px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid var(--yellow);
  border-radius: 8px;
  color: var(--yellow);
  font-size: 13px;
  margin-bottom: 20px;
}

.seat-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.row-label {
  width: 24px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  text-align: center;
}

.row-seats {
  display: flex;
  gap: 10px;
}

.seat-btn {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
}

.seat-btn.available {
  background: var(--green);
  color: white;
}

.seat-btn.available:hover {
  transform: scale(1.12);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.5);
}

.seat-btn.selected {
  background: var(--yellow);
  color: #000;
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(255, 193, 7, 0.5);
}

.seat-btn.booked {
  background: var(--red);
  color: white;
  cursor: not-allowed;
  opacity: 0.5;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.legend-box {
  width: 18px;
  height: 18px;
  border-radius: 4px;
}

.legend-box.available { background: var(--green); }
.legend-box.selected { background: var(--yellow); }
.legend-box.booked { background: var(--red); }

.summary-section {
  position: sticky;
  top: 20px;
}

.summary-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border);
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 13px;
  color: var(--text-muted);
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
}

.seat-highlight {
  color: var(--yellow);
  font-size: 16px;
}

.seat-highlight.no-seat {
  color: var(--text-muted);
}

.divider {
  height: 1px;
  background: var(--border);
  margin: 20px 0;
}

.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-row.total {
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.price-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.price-value {
  font-size: 15px;
  font-weight: 600;
}

.total-value {
  font-size: 20px;
  font-weight: 800;
  color: var(--green);
}

.proceed-btn {
  width: 100%;
  background: var(--primary);
  color: white;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: var(--transition);
}

.proceed-btn:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

.proceed-btn:disabled {
  background: var(--bg-card-hover);
  color: var(--text-muted);
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .seat-layout {
    grid-template-columns: 1fr;
  }

  .summary-section {
    position: static;
  }

  .seat-btn {
    width: 44px;
    height: 44px;
    font-size: 11px;
  }

  .row-seats {
    gap: 6px;
  }
}

@media (max-width: 500px) {
  .seat-btn {
    width: 38px;
    height: 38px;
    font-size: 10px;
  }

  .legend {
    gap: 16px;
    flex-wrap: wrap;
  }
}

.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found h2 {
  font-size: 24px;
  margin-bottom: 12px;
}

.not-found p {
  color: var(--text-secondary);
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
</style>
