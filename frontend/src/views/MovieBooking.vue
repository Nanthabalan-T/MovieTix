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

const selectTheatre = (theatre) => {
  router.push({
    name: 'ShowSelection',
    params: { id: movieId.value },
    query: { theatre: theatre.name }
  })
}

onMounted(fetchMovie)
</script>

<template>
  <div class="movie-booking-page">
    <div class="container">
      <button class="back-btn" @click="router.back()">← Back</button>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading movie...</p>
      </div>

      <div v-else-if="error" class="not-found">
        <h2>{{ error }}</h2>
        <router-link to="/movies" class="browse-btn">Browse Movies</router-link>
      </div>

      <div v-else-if="movie" class="movie-detail">
        <div class="poster-section">
          <img :src="movie.poster" :alt="movie.title" class="poster" />
          <div class="rating-overlay">
            <span class="star">⭐</span>
            <span class="rating-value">{{ movie.rating }}</span>
          </div>
        </div>

        <div class="info-section">
          <h1 class="movie-title">{{ movie.title }}</h1>

          <div class="meta-tags">
            <span class="tag language">{{ movie.language }}</span>
            <span class="tag genre">{{ movie.genre }}</span>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Duration</span>
              <span class="detail-value">🕐 {{ movie.duration }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Year</span>
              <span class="detail-value">📅 {{ movie.year }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Rating</span>
              <span class="detail-value">⭐ {{ movie.rating }} / 10</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Genre</span>
              <span class="detail-value">🎬 {{ movie.genre }}</span>
            </div>
          </div>

          <p class="description">{{ movie.description }}</p>
        </div>
      </div>

      <div v-if="movie" class="theatres-section">
        <h2 class="section-title">Select Theatre</h2>

        <div class="theatres-list">
          <div
            v-for="theatre in theatres"
            :key="theatre.id"
            class="theatre-card"
            @click="selectTheatre(theatre)"
          >
            <div class="theatre-header">
              <div class="theatre-info">
                <h3 class="theatre-name">{{ theatre.name }}</h3>
                <p class="theatre-location">📍 {{ theatre.location }}, Madurai</p>
              </div>
              <div class="theatre-badges">
                <span v-for="badge in theatre.badges" :key="badge" class="badge">
                  {{ badge }}
                </span>
              </div>
            </div>

            <div class="theatre-hint">
              <span>Click to view show times →</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isLoading && !error && !movie" class="not-found">
        <h2>Movie not found</h2>
        <router-link to="/movies" class="browse-btn">Browse Movies</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-booking-page {
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

.movie-detail {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 40px;
  margin-bottom: 50px;
}

.poster-section {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 16px;
}

.rating-overlay {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  font-weight: 700;
  border: 1px solid rgba(229, 9, 20, 0.4);
}

.star {
  font-size: 16px;
}

.info-section {
  display: flex;
  flex-direction: column;
}

.movie-title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.2;
}

.meta-tags {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.tag {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.language {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.genre {
  background: rgba(229, 9, 20, 0.2);
  color: var(--primary);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-value {
  font-size: 16px;
  font-weight: 500;
}

.description {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.theatres-section {
  margin-top: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border);
}

.theatres-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.theatre-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border);
  transition: var(--transition);
  cursor: pointer;
}

.theatre-card:hover {
  border-color: rgba(229, 9, 20, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.theatre-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.theatre-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}

.theatre-location {
  font-size: 14px;
  color: var(--text-secondary);
}

.theatre-badges {
  display: flex;
  gap: 8px;
}

.badge {
  background: rgba(229, 9, 20, 0.15);
  color: var(--primary);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.theatre-hint {
  text-align: right;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.theatre-card:hover .theatre-hint {
  color: var(--primary);
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
  .movie-detail {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .poster {
    max-width: 250px;
    margin: 0 auto;
    display: block;
  }

  .movie-title {
    font-size: 28px;
  }

  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .theatre-header {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
