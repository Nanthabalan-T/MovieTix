<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/movies', query: { search: searchQuery.value } })
  }
}
</script>

<template>
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="highlight">Book</span> Your Perfect
        <span class="highlight">Movie</span> Experience
      </h1>
      <p class="hero-subtitle">
        Discover the latest movies, choose your seats, and enjoy the magic of cinema
      </p>

      <div class="search-container">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search movies, genres, or theatres..."
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">Search</button>
        </div>
      </div>

      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">50+</span>
          <span class="stat-label">Movies</span>
        </div>
        <div class="stat">
          <span class="stat-number">3</span>
          <span class="stat-label">Theatres</span>
        </div>
        <div class="stat">
          <span class="stat-number">1M+</span>
          <span class="stat-label">Happy Users</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f0f 100%);
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23E50914" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
  background-size: cover;
  opacity: 0.5;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(15, 15, 15, 0.8) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  padding: 40px 20px;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.highlight {
  color: var(--primary);
}

.hero-subtitle {
  font-size: 20px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-container {
  margin-bottom: 50px;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border-radius: 50px;
  padding: 8px 8px 8px 24px;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: var(--transition);
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.2);
}

.search-icon {
  font-size: 20px;
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

.search-btn {
  background: var(--primary);
  color: white;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  transition: var(--transition);
}

.search-btn:hover {
  background: var(--primary-hover);
  transform: scale(1.05);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  color: var(--primary);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-stats {
    gap: 30px;
  }

  .stat-number {
    font-size: 28px;
  }
}
</style>
