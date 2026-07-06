<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL;
const router = useRouter()
const bookingData = ref(null)

const customerName = ref('')
const customerPhone = ref('')
const customerEmail = ref('')

const nameError = ref('')
const phoneError = ref('')
const apiError = ref('')
const isSubmitting = ref(false)

onMounted(() => {
  const data = sessionStorage.getItem('bookingData')
  if (data) {
    bookingData.value = JSON.parse(data)
  } else {
    router.push('/')
  }
})

const validateName = () => {
  if (!customerName.value.trim()) {
    nameError.value = 'Name is required'
    return false
  }
  nameError.value = ''
  return true
}

const validatePhone = () => {
  const digits = customerPhone.value.replace(/\D/g, '')
  customerPhone.value = digits

  if (!digits) {
    phoneError.value = 'Mobile number is required'
    return false
  }
  if (digits.length !== 10) {
    phoneError.value = 'Must contain exactly 10 digits'
    return false
  }
  phoneError.value = ''
  return true
}

const isFormValid = computed(() => {
  return customerName.value.trim() &&
    customerPhone.value.length === 10 &&
    !nameError.value &&
    !phoneError.value
})

const getTodayDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const confirmBooking = async () => {
  const nameOk = validateName()
  const phoneOk = validatePhone()

  if (!nameOk || !phoneOk) return

  isSubmitting.value = true
  apiError.value = ''

  const payload = {
    movie_name: bookingData.value.movie.title,
    theatre_name: bookingData.value.theatre,
    show_date: bookingData.value.showDate || getTodayDate(),
    show_time: bookingData.value.showTime,
    seat_number: bookingData.value.seat,
    customer_name: customerName.value.trim(),
    customer_phone: customerPhone.value,
    booking_amount: bookingData.value.total,
    booking_status: 'BOOKED'
  }

  try {
    const response = await axios.post(`${API_BASE}/bookings`, payload)

    if (response.data.success) {
      const finalData = {
        ...bookingData.value,
        customer: {
          name: customerName.value.trim(),
          phone: customerPhone.value,
          email: customerEmail.value.trim()
        }
      }
      sessionStorage.setItem('bookingData', JSON.stringify(finalData))
      router.push({ name: 'BookingSuccess' })
    } else {
      apiError.value = response.data.message || 'Failed to create booking'
    }
  } catch (err) {
    apiError.value = err.response?.data?.message || 'Server error. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="booking-summary-page">
    <div class="container">
      <div v-if="bookingData" class="summary-content">
        <button class="back-btn" @click="router.back()">← Back</button>

        <div class="summary-card">
          <div class="movie-section">
            <img :src="bookingData.movie.poster" :alt="bookingData.movie.title" class="movie-poster" />
            <div class="movie-info">
              <h2 class="movie-title">{{ bookingData.movie.title }}</h2>
              <div class="movie-meta">
                <span class="meta-tag rating">⭐ {{ bookingData.movie.rating }}</span>
                <span class="meta-tag genre">{{ bookingData.movie.genre }}</span>
                <span class="meta-tag duration">{{ bookingData.movie.duration }}</span>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="booking-details">
            <div class="detail-row">
              <span class="detail-label">📍 Theatre</span>
              <span class="detail-value">{{ bookingData.theatre }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🕐 Show Time</span>
              <span class="detail-value">{{ bookingData.showTime }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Show Date</span>
              <span class="detail-value">{{ bookingData.showDate || 'Today' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">💺 Seat</span>
              <span class="detail-value seat-value">{{ bookingData.seat }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="price-breakdown">
            <div class="price-row">
              <span class="price-label">Ticket Price</span>
              <span class="price-value">₹{{ bookingData.ticketPrice }}</span>
            </div>
            <div class="price-row">
              <span class="price-label">Booking Fee</span>
              <span class="price-value">₹{{ bookingData.bookingFee }}</span>
            </div>
            <div class="price-row total-row">
              <span class="price-label">Total Amount</span>
              <span class="price-value total-value">₹{{ bookingData.total }}</span>
            </div>
          </div>
        </div>

        <div class="customer-card">
          <h3 class="form-title">Customer Details</h3>

          <div class="form-group">
            <label class="form-label">Customer Name <span class="required">*</span></label>
            <input
              v-model="customerName"
              type="text"
              class="form-input"
              :class="{ error: nameError }"
              placeholder="Enter your full name"
              @blur="validateName"
            />
            <span v-if="nameError" class="error-text">{{ nameError }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Mobile Number <span class="required">*</span></label>
            <input
              v-model="customerPhone"
              type="tel"
              class="form-input"
              :class="{ error: phoneError }"
              placeholder="Enter 10-digit mobile number"
              maxlength="10"
              @input="validatePhone"
              @blur="validatePhone"
            />
            <span v-if="phoneError" class="error-text">{{ phoneError }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address <span class="optional">(Optional)</span></label>
            <input
              v-model="customerEmail"
              type="email"
              class="form-input"
              placeholder="Enter your email address"
            />
          </div>

          <div v-if="apiError" class="api-error">
            <span class="error-icon">⚠️</span>
            <span>{{ apiError }}</span>
          </div>

          <button
            class="confirm-btn"
            :disabled="isSubmitting"
            @click="confirmBooking"
          >
            <span v-if="isSubmitting" class="btn-loading">
              <span class="spinner"></span>
              Processing...
            </span>
            <span v-else>Confirm Booking</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-summary-page {
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

.summary-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 32px;
  max-width: 700px;
  margin: 0 auto 24px;
  border: 1px solid var(--border);
}

.movie-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.movie-poster {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
}

.movie-info {
  flex: 1;
}

.movie-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
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

.divider {
  height: 1px;
  background: var(--border);
  margin: 20px 0;
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.detail-value {
  font-weight: 600;
  font-size: 15px;
}

.seat-value {
  background: var(--yellow);
  color: #000;
  padding: 4px 14px;
  border-radius: 8px;
  font-weight: 700;
}

.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-row {
  padding-top: 10px;
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

.customer-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 32px;
  max-width: 700px;
  margin: 0 auto;
  border: 1px solid var(--border);
}

.form-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.required {
  color: var(--primary);
}

.optional {
  color: var(--text-muted);
  font-weight: 400;
  font-size: 12px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 15px;
  transition: var(--transition);
  box-sizing: border-box;
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.15);
}

.form-input.error {
  border-color: var(--red);
}

.error-text {
  display: block;
  color: var(--red);
  font-size: 12px;
  margin-top: 6px;
}

.api-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid var(--red);
  border-radius: 8px;
  color: var(--red);
  font-size: 14px;
  margin-bottom: 16px;
}

.error-icon {
  font-size: 16px;
}

.confirm-btn {
  width: 100%;
  background: var(--primary);
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 8px;
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.confirm-btn:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .movie-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .movie-meta {
    justify-content: center;
  }

  .summary-card,
  .customer-card {
    padding: 24px;
  }
}
</style>
