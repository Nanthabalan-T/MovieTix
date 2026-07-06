<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import TheatreCard from '../components/TheatreCard.vue'
import { theatres } from '../data/theatres'

const API_BASE = import.meta.env.VITE_API_URL;
const route = useRoute()
const router = useRouter()

const movie = ref(null)
const isLoading = ref(true)
const error = ref(null)

const movieId = computed(() => Number(route.params.movieId))

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

const handleSelectShow = ({ showTime, theatreName }) => {
  router.push({
    name: 'SeatSelection',
    params: { id: movieId.value },
    query: { theatre: theatreName, show: showTime }
  })
}

onMounted(fetchMovie)
</script>

<template>
  <div class="theatre-page">
    <div class="container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading movie...</p>
      </div>

      <div v-else-if="error || !movie" class="not-found">
        <h2>{{ error || 'Movie not found' }}</h2>
        <router-link to="/movies" class="browse-btn">Browse Movies</router-link>
      </div>

      <div v-else class="movie-banner">
        <img :src="movie.poster" :alt="movie.title" class="movie-poster" />
        <div class="movie-details">
          <h1 class="movie-title">{{ movie.title }}</h1>
          <div class="movie-meta">
            <span class="rating">⭐ {{ movie.rating }}</span>
            <span class="genre">{{ movie.genre }}</span>
            <span class="duration">{{ movie.duration }}</span>
            <span class="language">{{ movie.language }}</span>
          </div>
          <p class="movie-description">{{ movie.description }}</p>
        </div>
      </div>

      <div class="theatre-section">
        <h2 class="section-title">📍 Select Theatre & Show Time</h2>
        <p class="section-subtitle">Choose your preferred theatre and show time</p>

        <div class="theatres-list">
          <TheatreCard
            v-for="theatre in theatres"
            :key="theatre.id"
            :theatre="theatre"
            :movieId="movieId"
            @selectShow="handleSelectShow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theatre-page {
  padding: 40px 0 60px;
}

.movie-banner {
  display: flex;
  gap: 40px;
  padding: 30px;
  background: var(--bg-card);
  border-radius: var(--border-radius);
  margin-bottom: 50px;
}

.movie-poster {
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
}

.movie-details {
  flex: 1;
}

.movie-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 15px;
}

.movie-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.movie-meta span {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.rating {
  background: rgba(255, 215, 0, 0.2);
  color: #FFD700;
}

.genre {
  background: rgba(229, 9, 20, 0.2);
  color: var(--primary);
}

.duration,
.language {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

.movie-description {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 16px;
}

.theatre-section {
  margin-top: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  margin-bottom: 30px;
}

.theatres-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

@media (max-width: 768px) {
  .movie-banner {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .movie-poster {
    width: 160px;
    height: 240px;
  }

  .movie-meta {
    justify-content: center;
  }

  .movie-title {
    font-size: 24px;
  }
}
</style>
