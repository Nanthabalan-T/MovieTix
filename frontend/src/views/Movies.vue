<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import MovieCard from '../components/MovieCard.vue'

const API_BASE = 'http://localhost:5005/api'
const route = useRoute()
const searchQuery = ref('')
const selectedGenre = ref('All')
const movies = ref([])
const isLoading = ref(true)

const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Animation', 'Tamil', 'Telugu', 'Hindi', 'English']

const fetchMovies = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${API_BASE}/movies`)
    movies.value = res.data.data
  } catch (err) {
    console.error('Failed to fetch movies:', err)
  } finally {
    isLoading.value = false
  }
}

const filteredMovies = computed(() => {
  return movies.value.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesGenre = selectedGenre.value === 'All' || movie.genre === selectedGenre.value
    return matchesSearch && matchesGenre
  })
})

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  fetchMovies()
})
</script>

<template>
  <div class="movies-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Now Showing</h1>
        <p class="page-subtitle">Discover and book your favorite movies</p>
      </div>

      <div class="filters">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search movies..."
          />
        </div>

        <div class="genre-filter">
          <button
            v-for="genre in genres"
            :key="genre"
            class="genre-btn"
            :class="{ active: selectedGenre === genre }"
            @click="selectedGenre = genre"
          >
            {{ genre }}
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading movies...</p>
      </div>

      <div v-else class="movies-grid">
        <MovieCard
          v-for="movie in filteredMovies"
          :key="movie.id"
          :movie="movie"
        />
      </div>

      <div v-if="!isLoading && filteredMovies.length === 0" class="no-results">
        <span class="no-results-icon">🎬</span>
        <h3>No movies found</h3>
        <p>Try adjusting your search or filter</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movies-page {
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

.filters {
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border-radius: 50px;
  padding: 8px 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: var(--transition);
}

.search-box:focus-within {
  border-color: var(--primary);
}

.search-icon {
  font-size: 18px;
  margin-right: 12px;
}

.search-box input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 16px;
  padding: 12px 0;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.genre-filter {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.genre-btn {
  background: var(--bg-card);
  color: var(--text-secondary);
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: 500;
  font-size: 14px;
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.genre-btn:hover {
  background: var(--bg-card-hover);
}

.genre-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
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

.no-results {
  text-align: center;
  padding: 80px 20px;
}

.no-results-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 20px;
}

.no-results h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.no-results p {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .movies-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
</style>
