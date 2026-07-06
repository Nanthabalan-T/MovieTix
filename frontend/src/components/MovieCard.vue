<script setup>
defineProps({
  movie: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="movie-card">
    <div class="poster-container">
      <img :src="movie.poster" :alt="movie.title" class="poster" />
      <div class="overlay">
        <router-link :to="`/movie/${movie.id}`" class="book-btn">
          Book Now
        </router-link>
      </div>
      <div class="rating-badge">
        <span>⭐</span>
        <span>{{ movie.rating }}</span>
      </div>
    </div>

    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <div class="movie-meta">
        <span class="genre">{{ movie.genre }}</span>
        <span class="duration">{{ movie.duration }}</span>
      </div>
      <div class="movie-details">
        <span class="language">{{ movie.language }}</span>
        <span class="year">{{ movie.year }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
}

.movie-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.poster-container {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.movie-card:hover .poster {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: var(--transition);
}

.movie-card:hover .overlay {
  opacity: 1;
}

.book-btn {
  background: var(--primary);
  color: white;
  padding: 12px 32px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  transition: var(--transition);
  transform: translateY(20px);
}

.movie-card:hover .book-btn {
  transform: translateY(0);
}

.book-btn:hover {
  background: var(--primary-hover);
}

.rating-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
}

.movie-info {
  padding: 16px;
}

.movie-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.genre {
  background: rgba(229, 9, 20, 0.2);
  color: var(--primary);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.duration {
  color: var(--text-secondary);
  font-size: 12px;
  display: flex;
  align-items: center;
}

.movie-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
