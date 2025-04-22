import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeatherByCoords = async (lat, lon) => {
  if (!API_KEY) {
    console.error("OpenWeatherMap API Key not found. Make sure it's set in .env");
    throw new Error("API Key missing");
  }
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric' // Use metric units (Celsius)
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Handle specific error cases if needed (e.g., 401 Unauthorized for bad API key)
    throw error; // Re-throw the error to be caught by the component
  }
};