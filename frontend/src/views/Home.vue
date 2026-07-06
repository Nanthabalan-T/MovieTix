<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import HeroBanner from '../components/HeroBanner.vue'
import WeatherWidget from '../components/WeatherWidget.vue'
import MovieCard from '../components/MovieCard.vue'
import { theatres } from '../data/theatres'

const API_BASE = import.meta.env.VITE_API_URL;

const trendingMovies = ref([])
const featuredMovies = ref([])
const isLoading = ref(true)

const fetchMovies = async () => {
  isLoading.value = true
  try {
    const [trendingRes, featuredRes] = await Promise.all([
      axios.get(`${API_BASE}/movies`, { params: { trending: 'true' } }),
      axios.get(`${API_BASE}/movies`, { params: { featured: 'true' } })
    ])
    trendingMovies.value = trendingRes.data.data
    featuredMovies.value = featuredRes.data.data
  } catch (err) {
    console.error('Failed to fetch movies:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchMovies)
</script>

<template>
  <div class="home-page">
    <HeroBanner />

    <section class="section weather-section">
      <div class="container">
        <WeatherWidget />
      </div>
    </section>

    <section class="section trending-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🔥 Trending Now</h2>
          <router-link to="/movies" class="view-all">View All →</router-link>
        </div>
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading movies...</p>
        </div>
        <div v-else class="movies-grid">
          <MovieCard v-for="movie in trendingMovies" :key="movie.id" :movie="movie" />
        </div>
      </div>
    </section>

    <section class="section today-shows-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🎬 Today's Shows</h2>
          <router-link to="/theatres" class="view-all">View All Theatres →</router-link>
        </div>
        <div class="theatres-grid">
          <div v-for="theatre in theatres" :key="theatre.id" class="today-theatre-card">
            <div class="theatre-header">
              <div class="theatre-info">
                <h3 class="theatre-name">{{ theatre.name }}</h3>
                <p class="theatre-location">📍 {{ theatre.location }}</p>
              </div>
              <div class="theatre-badges">
                <span v-for="badge in theatre.badges" :key="badge" class="badge">
                  {{ badge }}
                </span>
              </div>
            </div>
            <div class="show-times">
              <div class="show-time-item">
                <span class="show-label">🌅 Morning</span>
                <span class="show-time">{{ theatre.shows.morning.time }}</span>
              </div>
              <div class="show-time-item">
                <span class="show-label">☀️ Matinee</span>
                <span class="show-time">{{ theatre.shows.afternoon.time }}</span>
              </div>
              <div class="show-time-item">
                <span class="show-label">🌆 Evening</span>
                <span class="show-time">{{ theatre.shows.evening.time }}</span>
              </div>
              <div class="show-time-item">
                <span class="show-label">🌙 Night</span>
                <span class="show-time">{{ theatre.shows.night.time }}</span>
              </div>
            </div>
            <router-link :to="`/theatre/1`" class="select-show-btn">
              Select Show
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="section featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">⭐ Featured Movies</h2>
          <router-link to="/movies" class="view-all">View All →</router-link>
        </div>
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading movies...</p>
        </div>
        <div v-else class="movies-grid">
          <MovieCard v-for="movie in featuredMovies" :key="movie.id" :movie="movie" />
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <h2>Ready for the Ultimate Movie Experience?</h2>
          <p>Download our app and get exclusive offers on movie tickets</p>
          <router-link to="/movies" class="cta-btn">Explore Movies</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  padding-bottom: 60px;
}

.section {
  padding: 60px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
}

.view-all {
  color: var(--primary);
  font-weight: 600;
  transition: var(--transition);
}

.view-all:hover {
  color: var(--primary-hover);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

.theatres-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.today-theatre-card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: var(--transition);
}

.today-theatre-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(229, 9, 20, 0.15);
  border-color: rgba(229, 9, 20, 0.3);
}

.theatre-header {
  margin-bottom: 20px;
}

.theatre-name {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 6px;
  background: linear-gradient(135deg, #ffffff, #b3b3b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theatre-location {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 10px;
}

.theatre-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  background: rgba(229, 9, 20, 0.15);
  color: var(--primary);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid rgba(229, 9, 20, 0.3);
}

.show-times {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.show-time-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  text-align: center;
}

.show-label {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.show-time {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.select-show-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: white;
  text-align: center;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: var(--transition);
}

.select-show-btn:hover {
  background: var(--primary-hover);
  transform: scale(1.02);
}

.cta-section {
  padding: 40px 0 60px;
}

.cta-card {
  background: linear-gradient(135deg, var(--primary), #ff4757);
  border-radius: var(--border-radius);
  padding: 60px 40px;
  text-align: center;
}

.cta-card h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 15px;
}

.cta-card p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 30px;
}

.cta-btn {
  display: inline-block;
  background: white;
  color: var(--primary);
  padding: 14px 40px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  transition: var(--transition);
}

.cta-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

@media (max-width: 1024px) {
  .theatres-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 22px;
  }

  .movies-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .theatres-grid {
    grid-template-columns: 1fr;
  }

  .cta-card {
    padding: 40px 20px;
  }

  .cta-card h2 {
    font-size: 24px;
  }
}
</style>
