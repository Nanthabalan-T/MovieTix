<script setup>
defineProps({
  theatre: {
    type: Object,
    required: true
  },
  movieId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['selectShow'])

const selectShow = (show) => {
  emit('selectShow', { showTime: show.time, theatreName: theatre.name, theatreId: theatre.id })
}
</script>

<template>
  <div class="theatre-card">
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

    <div class="shows-container">
      <div class="show-type">
        <span class="show-label">🌅 Morning</span>
        <router-link
          v-if="movieId"
          :to="`/seats/${movieId}/${theatre.id}/morning`"
          class="show-btn"
          @click.prevent="selectShow(theatre.shows.morning)"
        >
          <span class="show-time">{{ theatre.shows.morning.time }}</span>
          <span class="show-price">₹{{ theatre.shows.morning.price }}</span>
        </router-link>
        <div v-else class="show-btn disabled">
          <span class="show-time">{{ theatre.shows.morning.time }}</span>
          <span class="show-price">₹{{ theatre.shows.morning.price }}</span>
        </div>
      </div>

      <div class="show-type">
        <span class="show-label">☀️ Matinee</span>
        <router-link
          v-if="movieId"
          :to="`/seats/${movieId}/${theatre.id}/afternoon`"
          class="show-btn"
          @click.prevent="selectShow(theatre.shows.afternoon)"
        >
          <span class="show-time">{{ theatre.shows.afternoon.time }}</span>
          <span class="show-price">₹{{ theatre.shows.afternoon.price }}</span>
        </router-link>
        <div v-else class="show-btn disabled">
          <span class="show-time">{{ theatre.shows.afternoon.time }}</span>
          <span class="show-price">₹{{ theatre.shows.afternoon.price }}</span>
        </div>
      </div>

      <div class="show-type">
        <span class="show-label">🌆 Evening</span>
        <router-link
          v-if="movieId"
          :to="`/seats/${movieId}/${theatre.id}/evening`"
          class="show-btn"
          @click.prevent="selectShow(theatre.shows.evening)"
        >
          <span class="show-time">{{ theatre.shows.evening.time }}</span>
          <span class="show-price">₹{{ theatre.shows.evening.price }}</span>
        </router-link>
        <div v-else class="show-btn disabled">
          <span class="show-time">{{ theatre.shows.evening.time }}</span>
          <span class="show-price">₹{{ theatre.shows.evening.price }}</span>
        </div>
      </div>

      <div class="show-type">
        <span class="show-label">🌙 Night</span>
        <router-link
          v-if="movieId"
          :to="`/seats/${movieId}/${theatre.id}/night`"
          class="show-btn"
          @click.prevent="selectShow(theatre.shows.night)"
        >
          <span class="show-time">{{ theatre.shows.night.time }}</span>
          <span class="show-price">₹{{ theatre.shows.night.price }}</span>
        </router-link>
        <div v-else class="show-btn disabled">
          <span class="show-time">{{ theatre.shows.night.time }}</span>
          <span class="show-price">₹{{ theatre.shows.night.price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theatre-card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.theatre-card:hover {
  box-shadow: 0 10px 40px rgba(229, 9, 20, 0.15);
  border-color: rgba(229, 9, 20, 0.3);
  transform: translateY(-5px);
}

.theatre-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.theatre-info {
  flex: 1;
}

.theatre-name {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 6px;
  background: linear-gradient(135deg, #ffffff, #b3b3b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.theatre-location {
  color: var(--text-secondary);
  font-size: 14px;
}

.theatre-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.badge {
  background: rgba(229, 9, 20, 0.15);
  color: var(--primary);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid rgba(229, 9, 20, 0.3);
}

.shows-container {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.show-type {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.show-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
}

.show-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: var(--transition);
  cursor: pointer;
}

.show-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(229, 9, 20, 0.3);
}

.show-btn.disabled {
  cursor: default;
  opacity: 0.7;
}

.show-btn.disabled:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  transform: none;
  box-shadow: none;
}

.show-time {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.show-price {
  font-size: 13px;
  color: var(--green);
  font-weight: 600;
}

.show-btn:hover .show-time {
  color: white;
}

.show-btn:hover .show-price {
  color: white;
}

@media (max-width: 768px) {
  .theatre-header {
    flex-direction: column;
    gap: 12px;
  }

  .theatre-badges {
    justify-content: flex-start;
  }

  .shows-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
