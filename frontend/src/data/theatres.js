export const theatres = [
  {
    id: 1,
    name: "CINEPRIYA",
    location: "Madurai Main City",
    badges: ["AC", "Dolby Atmos", "4K"],
    shows: {
      morning: { time: "09:30 AM", price: 180, seats: generateSeats() },
      afternoon: { time: "01:30 PM", price: 220, seats: generateSeats() },
      evening: { time: "06:30 PM", price: 280, seats: generateSeats() },
      night: { time: "09:30 PM", price: 320, seats: generateSeats() }
    }
  },
  {
    id: 2,
    name: "MINIPRIYA",
    location: "Thiruparankundram, Madurai",
    badges: ["AC", "Dolby Atmos", "2K"],
    shows: {
      morning: { time: "09:30 AM", price: 160, seats: generateSeats() },
      afternoon: { time: "01:30 PM", price: 200, seats: generateSeats() },
      evening: { time: "06:30 PM", price: 260, seats: generateSeats() },
      night: { time: "09:30 PM", price: 300, seats: generateSeats() }
    }
  },
  {
    id: 3,
    name: "SUGAPRIYA",
    location: "Melur, Madurai",
    badges: ["AC", "4K"],
    shows: {
      morning: { time: "09:30 AM", price: 140, seats: generateSeats() },
      afternoon: { time: "01:30 PM", price: 180, seats: generateSeats() },
      evening: { time: "06:30 PM", price: 240, seats: generateSeats() },
      night: { time: "09:30 PM", price: 280, seats: generateSeats() }
    }
  }
]

function generateSeats() {
  const seats = []
  const rows = ['A', 'B', 'C']
  for (const row of rows) {
    for (let i = 1; i <= 5; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status: 'available'
      })
    }
  }
  return seats
}
