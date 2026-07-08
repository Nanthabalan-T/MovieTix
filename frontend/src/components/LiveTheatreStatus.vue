<template>
  <div class="live-status-card" v-if="theatre">
    <div class="card-header">
      <div>
        <h3>📡 Live Theatre Status</h3>
        <p class="theatre-name">🏢 {{ theatre.theatre }}</p>
      </div>

      <span class="live-badge">🟢 LIVE</span>
    </div>

    <div class="shows-list">
      <div
        v-for="(show, index) in theatre.shows"
        :key="index"
        class="show-item"
      >
        <span class="show-time">
          🎬 {{ show.time }}
        </span>

        <span class="show-price">
          🎟 ₹{{ show.price }}
        </span>
      </div>
    </div>

    <div class="last-updated">
      🕒 Last Updated : {{ theatre.lastUpdated }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const theatre = ref(null);

let socket = null;

onMounted(() => {
  socket = new WebSocket("ws://localhost:5005");

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");
  };

  socket.onmessage = (event) => {
    theatre.value = JSON.parse(event.data);
  };

  socket.onclose = () => {
    console.log("❌ WebSocket Disconnected");
  };

  socket.onerror = (err) => {
    console.error("WebSocket Error:", err);
  };
});

onBeforeUnmount(() => {
  if (socket) {
    socket.close();
  }
});
</script>

<style scoped>
.live-status-card {
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 22px 28px;
  margin-bottom: 40px;
  transition: var(--transition);
}

.live-status-card:hover {
  border-color: rgba(229, 9, 20, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.card-header h3 {
  margin: 0;
  color: var(--primary);
  font-size: 22px;
  font-weight: 700;
}

.theatre-name {
  margin-top: 6px;
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 700;
}

.live-badge {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
  border: 1px solid #22c55e;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 700;
}

.shows-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.show-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  padding: 10px 16px;
  transition: 0.25s;
}

.show-item:hover {
  background: rgba(229, 9, 20, 0.1);
}

.show-time {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.show-price {
  font-size: 15px;
  font-weight: 700;
  color: #22c55e;
}

.last-updated {
  margin-top: 16px;
  text-align: right;
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 768px) {

  .live-status-card {
    padding: 18px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .live-badge {
    align-self: flex-start;
  }

  .show-item {
    padding: 10px 12px;
  }

  .show-time,
  .show-price {
    font-size: 14px;
  }

}
</style>
