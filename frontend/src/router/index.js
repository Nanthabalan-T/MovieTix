import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Movies from '../views/Movies.vue'
import Theatres from '../views/Theatres.vue'
import Theatre from '../views/Theatre.vue'
import MovieBooking from '../views/MovieBooking.vue'
import ShowSelection from '../views/ShowSelection.vue'
import SeatSelection from '../views/SeatSelection.vue'
import BookingSummary from '../views/BookingSummary.vue'
import BookingSuccess from '../views/BookingSuccess.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/movies', name: 'Movies', component: Movies },
  { path: '/movie/:id', name: 'MovieBooking', component: MovieBooking },
  { path: '/movie/:id/show', name: 'ShowSelection', component: ShowSelection },
  { path: '/movie/:id/seats', name: 'SeatSelection', component: SeatSelection },
  { path: '/theatres', name: 'Theatres', component: Theatres },
  { path: '/theatre/:movieId', name: 'Theatre', component: Theatre },
  { path: '/seats/:movieId/:theatreId/:showTime', name: 'SeatSelectionOld', component: SeatSelection },
  { path: '/booking-summary', name: 'BookingSummary', component: BookingSummary },
  { path: '/booking-success', name: 'BookingSuccess', component: BookingSuccess },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
