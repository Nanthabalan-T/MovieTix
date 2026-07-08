const theatres = [
    {
        theatre: "CINEPRIYA",
        shows: [
            { time: "09:30 AM", price: 180 },
            { time: "01:30 PM", price: 220 },
            { time: "06:30 PM", price: 250 },
            { time: "09:30 PM", price: 300 }
        ]
    },
    {
        theatre: "MINIPRIYA",
        shows: [
            { time: "10:00 AM", price: 150 },
            { time: "02:00 PM", price: 180 },
            { time: "06:45 PM", price: 220 },
            { time: "10:00 PM", price: 250 }
        ]
    },
    {
        theatre: "SUGAPRIYA",
        shows: [
            { time: "09:45 AM", price: 160 },
            { time: "01:45 PM", price: 200 },
            { time: "06:15 PM", price: 240 },
            { time: "09:45 PM", price: 280 }
        ]
    }
];

let currentIndex = 0;

function getNextTheatreStatus() {
    const theatre = theatres[currentIndex];

    currentIndex = (currentIndex + 1) % theatres.length;

    return {
        ...theatre,
        lastUpdated: new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        })
    };
}

module.exports = {
    getNextTheatreStatus
};