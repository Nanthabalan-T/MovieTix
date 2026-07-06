<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_WEATHER_API_URL;

const weather = ref(null)
const loading = ref(true)
const error = ref(null)

let refreshInterval = null

const getWeatherIcon = (weatherMain) => {
  const icons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️'
  }
  return icons[weatherMain] || '🌤️'
}

const fetchWeather = async () => {
  try {
    const res = await axios.get(`${API_BASE}/weather`)
    weather.value = res.data.data
    error.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Weather service unavailable'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWeather()
  refreshInterval = setInterval(fetchWeather, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})

const formatTime = (iso) => {
  if (!iso) return '--'
  const d = new Date(iso)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="weather-widget">
    <!-- Loading -->
    <div v-if="loading" class="weather-loading">
      <div class="weather-spinner"></div>
      <span>Loading weather...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error && !weather" class="weather-error">
      <span class="error-icon">⚠️</span>
      <span>{{ error }}</span>
    </div>

    <!-- Weather Data -->
    <div v-else class="weather-card">
      <div class="weather-left">
        <div class="weather-icon animate-bounce">
          {{ getWeatherIcon(weather?.weatherMain) }}
        </div>
        <div class="weather-temp">
          <span class="temp-value">{{ weather?.temperature }}°C</span>
          <span class="weather-desc">{{ weather?.description }}</span>
        </div>
      </div>

      <div class="weather-divider"></div>

      <div class="weather-right">
        <div class="weather-location">
          📍 {{ weather?.city }}, {{ weather?.country }}
        </div>
        <div class="weather-details">
          <div class="detail-item">
            <span class="detail-label">🤒 Feels Like</span>
            <span class="detail-value">{{ weather?.feelsLike }}°C</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">💧 Humidity</span>
            <span class="detail-value">{{ weather?.humidity }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">🌬 Wind</span>
            <span class="detail-value">{{ weather?.windSpeed }} m/s</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">🕒 Updated</span>
            <span class="detail-value">{{ formatTime(weather?.lastUpdated) }}</span>
          </div>
        </div>
      </div>

      <div v-if="weather?.dummy" class="dummy-badge">Demo</div>
    </div>
  </div>
</template>

<style scoped>
.weather-widget {
  margin-bottom: 50px;
}

.weather-loading,
.weather-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  color: var(--text-secondary);
  font-size: 14px;
}

.weather-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 20px;
}

.weather-card {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 28px 36px;
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  position: relative;
  transition: var(--transition);
}

.weather-card:hover {
  border-color: rgba(229, 9, 20, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.weather-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.weather-icon {
  font-size: 52px;
  line-height: 1;
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.weather-temp {
  display: flex;
  flex-direction: column;
}

.temp-value {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}

.weather-desc {
  font-size: 13px;
  color: var(--text-secondary);
  text-transform: capitalize;
  margin-top: 4px;
}

.weather-divider {
  width: 1px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
}

.weather-right {
  flex: 1;
}

.weather-location {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 11px;
  color: var(--text-muted);
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
}

.dummy-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 215, 0, 0.15);
  color: var(--yellow);
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .weather-card {
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    text-align: center;
  }

  .weather-divider {
    width: 60px;
    height: 1px;
  }

  .weather-details {
    grid-template-columns: repeat(2, 1fr);
    text-align: left;
  }

  .weather-icon {
    font-size: 44px;
  }

  .temp-value {
    font-size: 30px;
  }
}
</style>
