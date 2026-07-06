<script setup>
import { ref } from 'vue'

const props = defineProps({
  seats: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggleSeat'])

const toggleSeat = (seat) => {
  if (seat.status === 'booked') return
  emit('toggleSeat', seat)
}
</script>

<template>
  <div class="seat-selection">
    <div class="screen">
      <div class="screen-curve"></div>
      <span>SCREEN</span>
    </div>

    <div class="seats-container">
      <div v-for="row in ['A', 'B', 'C']" :key="row" class="seat-row">
        <span class="row-label">{{ row }}</span>
        <div class="seats">
          <button
            v-for="seat in seats.filter(s => s.row === row)"
            :key="seat.id"
            class="seat"
            :class="{
              available: seat.status === 'available',
              booked: seat.status === 'booked',
              selected: seat.status === 'selected'
            }"
            :disabled="seat.status === 'booked'"
            @click="toggleSeat(seat)"
          >
            {{ seat.number }}
          </button>
        </div>
        <span class="row-label">{{ row }}</span>
      </div>
    </div>

    <div class="seat-legend">
      <div class="legend-item">
        <span class="legend-seat available"></span>
        <span>Available</span>
      </div>
      <div class="legend-item">
        <span class="legend-seat selected"></span>
        <span>Selected</span>
      </div>
      <div class="legend-item">
        <span class="legend-seat booked"></span>
        <span>Booked</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seat-selection {
  padding: 30px;
  background: var(--bg-card);
  border-radius: var(--border-radius);
}

.screen {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.screen-curve {
  width: 200px;
  height: 10px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  margin: 0 auto 10px;
  border-radius: 50%;
  opacity: 0.6;
}

.screen span {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 3px;
}

.seats-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 300px;
  margin: 0 auto;
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.row-label {
  width: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
}

.seats {
  display: flex;
  gap: 8px;
}

.seat {
  width: 40px;
  height: 40px;
  border-radius: 8px 8px 4px 4px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.seat.available {
  background: var(--green);
  color: white;
}

.seat.available:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
}

.seat.booked {
  background: var(--red);
  color: white;
  cursor: not-allowed;
  opacity: 0.6;
}

.seat.selected {
  background: var(--yellow);
  color: #1a1a1a;
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
}

.seat-legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.legend-seat {
  width: 24px;
  height: 24px;
  border-radius: 6px 6px 3px 3px;
}

.legend-seat.available {
  background: var(--green);
}

.legend-seat.selected {
  background: var(--yellow);
}

.legend-seat.booked {
  background: var(--red);
}
</style>
