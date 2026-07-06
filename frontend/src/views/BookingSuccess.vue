<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const bookingData = ref(null)
const bookingId = ref('')

onMounted(() => {
  const data = sessionStorage.getItem('bookingData')
  if (data) {
    bookingData.value = JSON.parse(data)
    bookingId.value = 'MTB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase()
    sessionStorage.removeItem('bookingData')
  } else {
    router.push('/')
  }
})

const goHome = () => {
  router.push('/')
}

const bookAgain = () => {
  router.push('/movies')
}
</script>

<template>
  <div class="success-page">
    <div class="container">
      <div v-if="bookingData" class="success-content">
        <div class="success-card">
          <div class="success-icon">✅</div>
          <h1 class="success-title">Booking Confirmed!</h1>
          <p class="success-subtitle">Your tickets have been booked successfully</p>
          <p class="booking-id">Booking ID: <strong>{{ bookingId }}</strong></p>

          <div class="divider"></div>

          <div class="ticket-card">
            <div class="ticket-header">
              <span class="ticket-label">E-TICKET</span>
            </div>

            <div class="ticket-body">
              <div class="movie-row">
                <img :src="bookingData.movie.poster" :alt="bookingData.movie.title" class="ticket-poster" />
                <div class="movie-details">
                  <h3 class="movie-name">{{ bookingData.movie.title }}</h3>
                  <span class="movie-rating">⭐ {{ bookingData.movie.rating }}</span>
                </div>
              </div>

              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Theatre</span>
                  <span class="detail-value">{{ bookingData.theatre }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Show Time</span>
                  <span class="detail-value">{{ bookingData.showTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Show Date</span>
                  <span class="detail-value">{{ bookingData.showDate || 'Today' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Seat</span>
                  <span class="detail-value seat-badge">{{ bookingData.seat }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Amount Paid</span>
                  <span class="detail-value amount">₹{{ bookingData.total }}</span>
                </div>
              </div>

              <div class="customer-info">
                <div class="detail-item">
                  <span class="detail-label">Booked By</span>
                  <span class="detail-value">{{ bookingData.customer.name }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">{{ bookingData.customer.phone }}</span>
                </div>
                <div class="detail-item" v-if="bookingData.customer.email">
                  <span class="detail-label">Email</span>
                  <span class="detail-value">{{ bookingData.customer.email }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="info-box">
            <p>📱 Please arrive at the theatre 15 minutes before the show time</p>
            <p>🎫 Show this ticket at the counter for entry</p>
          </div>

          <div class="action-buttons">
            <button class="home-btn" @click="goHome">Back to Home</button>
            <button class="again-btn" @click="bookAgain">Book Again</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-page {
  padding: 40px 0 60px;
}

.success-content {
  display: flex;
  justify-content: center;
}

.success-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 1px solid var(--border);
}

.success-icon {
  font-size: 72px;
  margin-bottom: 16px;
  animation: popIn 0.5s ease-out;
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.success-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--green);
}

.success-subtitle {
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.booking-id {
  font-family: monospace;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.booking-id strong {
  color: var(--text-primary);
  font-size: 16px;
}

.divider {
  height: 1px;
  background: var(--border);
  margin: 24px 0;
}

.ticket-card {
  border: 1px dashed var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.ticket-header {
  background: rgba(229, 9, 20, 0.1);
  padding: 10px;
  border-bottom: 1px dashed var(--border);
}

.ticket-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--primary);
}

.ticket-body {
  padding: 20px;
}

.movie-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  text-align: left;
}

.ticket-poster {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}

.movie-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
}

.movie-rating {
  font-size: 14px;
  color: var(--text-secondary);
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  text-align: left;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
}

.seat-badge {
  display: inline-block;
  background: var(--yellow);
  color: #000;
  padding: 2px 10px;
  border-radius: 6px;
  font-weight: 700;
  width: fit-content;
}

.amount {
  color: var(--green);
  font-size: 16px;
  font-weight: 800;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  text-align: left;
}

.info-box {
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 24px;
  text-align: left;
}

.info-box p {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 8px;
}

.info-box p:last-child {
  margin-bottom: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.home-btn,
.again-btn {
  flex: 1;
  padding: 14px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
}

.home-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.home-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.again-btn {
  background: var(--primary);
  border: none;
  color: white;
}

.again-btn:hover {
  background: var(--primary-hover);
}

@media (max-width: 500px) {
  .success-card {
    padding: 24px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
