<script setup>
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-brand">
        <span class="brand-icon">🎬</span>
        <span class="brand-text">MovieTix</span>
        <p class="tagline">Book your perfect movie experience</p>
      </div>

      <div class="footer-links">
        <div class="footer-column">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>

        <div class="footer-column">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">FAQs</a>
          <a href="#">Terms of Service</a>
        </div>

        <div class="footer-column">
          <h4>Connect</h4>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2024 MovieTix. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-card);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px 30px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.brand-icon {
  font-size: 36px;
}

.brand-text {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #E50914, #FF6B6B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  color: var(--text-secondary);
  font-size: 14px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-column h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.footer-column a {
  color: var(--text-secondary);
  font-size: 14px;
  transition: var(--transition);
}

.footer-column a:hover {
  color: var(--primary);
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
