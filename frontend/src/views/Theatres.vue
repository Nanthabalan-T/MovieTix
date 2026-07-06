<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import TheatreCard from '../components/TheatreCard.vue'
import { theatres } from '../data/theatres'

const API_BASE = 'http://localhost:5005/api'
const movies = ref([])
const selectedMovie = ref(null)
const isLoading = ref(true)

const fetchMovies = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${API_BASE}/movies`)
    movies.value = res.data.data
    if (movies.value.length > 0) {
      selectedMovie.value = movies.value[0].id
    }
  } catch (err) {
    console.error('Failed to fetch movies:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchMovies)
</script>

<template>
  <div class="theatres-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">🎬 Our Theatres</h1>
        <p class="page-subtitle">Premium cinema experience across Chennai</p>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading movies...</p>
      </div>

      <template v-else>
        <div class="movie-selector">
          <label class="selector-label">Select Movie:</label>
          <select v-model="selectedMovie" class="movie-select">
            <option v-for="movie in movies" :key="movie.id" :value="movie.id">
              {{ movie.title }}
            </option>
          </select>
        </div>

        <div class="theatres-list">
          <TheatreCard
            v-for="theatre in theatres"
            :key="theatre.id"
            :theatre="theatre"
            :movieId="selectedMovie"
          />
        </div>
      </template>

      <div class="info-section">
        <div class="info-card">
          <span class="info-icon">🎭</span>
          <h3>Premium Experience</h3>
          <p>All our theatres feature state-of-the-art audio and visual technology</p>
        </div>
        <div class="info-card">
          <span class="info-icon">❄️</span>
          <h3>Fully Air Conditioned</h3>
          <p>Enjoy movies in complete comfort with our climate-controlled auditoriums</p>
        </div>
        <div class="info-card">
          <span class="info-icon">🔊</span>
          <h3>Dolby Atmos Sound</h3>
          <p>Immerse yourself in crystal-clear surround sound</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theatres-page {
  padding: 40px 0 60px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 10px;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 18px;
}

.movie-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
}

.selector-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.movie-select {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: var(--transition);
  min-width: 300px;
}

.movie-select:focus {
  outline: none;
  border-color: var(--primary);
}

.movie-select:hover {
  border-color: var(--primary);
}

.theatres-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 60px;
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

.info-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.info-card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 30px;
  text-align: center;
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.info-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.info-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.info-card p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .movie-selector {
    flex-direction: column;
  }

  .movie-select {
    width: 100%;
    min-width: auto;
  }

  .info-section {
    grid-template-columns: 1fr;
  }
}
</style>
