import React from 'react';
import {
  FiSun, FiCloud, FiCloudRain, FiCloudSnow, FiCloudLightning, FiWind, FiAlertTriangle, FiThermometer
} from 'react-icons/fi';
import { WiHumidity } from 'react-icons/wi'; // Use a weather specific icon library if needed


const WeatherDisplay = ({ weatherData, isLoading, error }) => {
  if (isLoading) {
    return <div className="text-center p-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">Fetching weather...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg flex items-center justify-center">
        <FiAlertTriangle className="mr-2"/> {error}
      </div>
    );
  }

  if (!weatherData) {
    return <div className="text-center p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">Weather data unavailable.</div>;
  }

  // Provide a default empty array for weather
  const { name, main, weather = [], wind } = weatherData;
  const description = weather[0]?.description || 'N/A';
  const iconCode = weather[0]?.icon; // e.g., '01d', '10n'

  // Basic mapping from OpenWeatherMap icon codes to react-icons
  const getWeatherIcon = (code) => {
    if (!code) return FiSun; // Default
    const firstTwo = code.substring(0, 2);
    switch (firstTwo) {
      case '01': return FiSun; // clear sky
      case '02': // few clouds
      case '03': // scattered clouds
      case '04': return FiCloud; // broken clouds, overcast clouds
      case '09': // shower rain
      case '10': return FiCloudRain; // rain
      case '11': return FiCloudLightning; // thunderstorm
      case '13': return FiCloudSnow; // snow
      case '50': return FiWind; // mist (using wind icon as placeholder)
      default: return FiSun;
    }
  };

  const WeatherIcon = getWeatherIcon(iconCode);

  return (
    <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg shadow text-blue-800 dark:text-blue-200">
      <h3 className="text-lg font-semibold mb-2 text-center">{name || 'Current Location'} Weather</h3>
      <div className="flex items-center justify-around text-center">
        <div className="flex flex-col items-center">
           <WeatherIcon size={40} className="mb-1"/>
           <span className="text-sm capitalize">{description}</span>
        </div>
        <div className="flex flex-col items-center">
            <div className="flex items-center">
                <FiThermometer className="mr-1"/>
                <span className="text-2xl font-bold">{Math.round(main?.temp ?? 0)}°C</span>
            </div>
            <span className="text-xs">Feels like {Math.round(main?.feels_like ?? 0)}°C</span>
        </div>
        <div className="hidden sm:flex flex-col items-center text-xs">
            <WiHumidity size={24} />
            <span>{main?.humidity ?? 'N/A'}% Hum.</span>
            <FiWind size={18} className="mt-1"/>
            <span>{Math.round(wind?.speed ?? 0)} m/s</span>
        </div>

      </div>
    </div>
  );
};

export default WeatherDisplay;