
const https = require('https');
require('dotenv').config();

const API_KEY = process.env.WEATHER_API_KEY;
const CITY = process.env.WEATHER_CITY || 'Madurai';
const COUNTRY = process.env.WEATHER_COUNTRY || 'IN';

let cachedWeather = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

function fetchWeatherFromAPI() {
  return new Promise((resolve, reject) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=metric&appid=${API_KEY}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.cod && parsed.cod !== 200) {
            reject(new Error(parsed.message || 'Weather API error'));
          } else {
            resolve(parsed);
          }
        } catch (err) {
          reject(new Error('Failed to parse weather response'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function getDummyWeather() {
  return {
    cod: 200,
    name: CITY,
    main: {
      temp: 32,
      feels_like: 36,
      humidity: 75
    },
    wind: {
      speed: 4.2
    },
    weather: [
      {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }
    ],
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: COUNTRY
    }
  };
}

function formatWeatherData(raw) {
  return {
    city: raw.name,
    country: raw.sys?.country || COUNTRY,
    temperature: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    description: raw.weather[0]?.description || 'N/A',
    weatherMain: raw.weather[0]?.main || 'Clear',
    icon: raw.weather[0]?.icon || '01d',
    lastUpdated: new Date().toISOString()
  };
}

async function getWeather() {
  const now = Date.now();

  if (cachedWeather && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
    return { ...cachedWeather, fromCache: true };
  }

  try {
    const raw = await fetchWeatherFromAPI();
    cachedWeather = formatWeatherData(raw);
    cacheTimestamp = now;
    return { ...cachedWeather, fromCache: false };
  } catch (error) {
    console.error('Weather API error:', error.message);

    if (cachedWeather) {
      return { ...cachedWeather, fromCache: true, stale: true };
    }

    const dummy = getDummyWeather();
    cachedWeather = formatWeatherData(dummy);
    cacheTimestamp = now;
    return { ...cachedWeather, fromCache: false, dummy: true };
  }
}

module.exports = { getWeather };
