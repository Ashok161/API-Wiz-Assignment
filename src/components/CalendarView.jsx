import React, { useState, useContext } from 'react';
import { EntriesContext } from '../contexts/EntriesContext';
import { moodOptions } from './MoodSelector'; // Import mood options for icons/colors
import { getDisplayDate } from '../utils/dateFormatter';
import { FiSun, FiCloud, FiCloudRain, FiCloudSnow, FiCloudLightning, FiWind, FiFilter, FiX, FiTrash2 } from 'react-icons/fi'; // Basic weather icons
import { WiThermometer, WiHumidity } from 'react-icons/wi';

// Helper to get basic weather icon based on stored description/icon code
const getWeatherIcon = (weather) => {
    if (!weather) return null;
    const iconCode = weather.icon;
    const description = weather.description?.toLowerCase() || '';

    if (iconCode) { // Prefer icon code if available
       const firstTwo = iconCode.substring(0, 2);
        switch (firstTwo) {
        case '01': return <FiSun aria-label="Clear sky"/>;
        case '02': case '03': case '04': return <FiCloud aria-label="Cloudy"/>;
        case '09': case '10': return <FiCloudRain aria-label="Rain"/>;
        case '11': return <FiCloudLightning aria-label="Thunderstorm"/>;
        case '13': return <FiCloudSnow aria-label="Snow"/>;
        case '50': return <FiWind aria-label="Mist/Fog"/>; // Placeholder
        default: return <FiSun aria-label="Weather"/>;
        }
    }
    // Fallback based on description text
    if (description.includes('clear')) return <FiSun aria-label="Clear sky"/>;
    if (description.includes('cloud')) return <FiCloud aria-label="Cloudy"/>;
    if (description.includes('rain') || description.includes('shower')) return <FiCloudRain aria-label="Rain"/>;
    if (description.includes('thunder')) return <FiCloudLightning aria-label="Thunderstorm"/>;
    if (description.includes('snow')) return <FiCloudSnow aria-label="Snow"/>;
    if (description.includes('mist') || description.includes('fog')) return <FiWind aria-label="Mist/Fog"/>;

    return <FiSun aria-label="Weather"/>; // Default fallback
};


const CalendarView = () => {
  const { entries, deleteEntry } = useContext(EntriesContext);
  const [filterMood, setFilterMood] = useState(''); // State for filtering

   const handleDelete = (id, date) => { // Accept id and date
     // Optional: Use date in the confirmation message
     if (window.confirm(`Are you sure you want to delete this entry from ${getDisplayDate(date)}?`)) {
       deleteEntry(id); // Call deleteEntry with the unique ID
     }
   };

  const filteredEntries = filterMood
    ? entries.filter(entry => entry.mood === filterMood)
    : entries;

  return (
    // *** MODIFICATION START ***
    // Added id="journal-entries-container" to this div
    // This ID is used by html2canvas in ExportButtons.jsx to capture this specific element
    <div id="journal-entries-container" className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
    {/* *** MODIFICATION END *** */}

      {/* Filter Controls */}
       <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2">
             <FiFilter className="text-gray-600 dark:text-gray-400" />
             <label htmlFor="moodFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
             Filter by Mood:
             </label>
             <select
                id="moodFilter"
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="block w-full sm:w-auto pl-3 pr-8 py-1.5 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
             >
             <option value="">All Moods</option>
             {moodOptions.map(option => (
                 <option key={option.mood} value={option.mood}>{option.mood}</option>
             ))}
             </select>
         </div>
          {filterMood && (
            <button
              onClick={() => setFilterMood('')}
              className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FiX className="mr-1"/> Clear Filter
            </button>
          )}
       </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          {filterMood ? `No entries found for mood "${filterMood}".` : 'No journal entries yet. Add one!'}
        </p>
      ) : (
         // Note: html2canvas might only capture the visible part of this scrollable list by default.
         // Capturing the entire list if it overflows requires more advanced html2canvas configuration.
        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {filteredEntries.map((entry) => {
            const moodInfo = moodOptions.find(m => m.mood === entry.mood);
            const MoodIcon = moodInfo ? moodInfo.icon : null;
            const moodColor = moodInfo ? moodInfo.color : 'bg-gray-300';
             const moodTextColor = moodInfo ? moodInfo.textColor : 'text-gray-800';
            const WeatherIcon = getWeatherIcon(entry.weather);

            return (
              <li key={entry.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <div className="flex-grow">
                  <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{getDisplayDate(entry.date)}</p>
                  <div className="flex items-center gap-2 my-2">
                    {MoodIcon && <MoodIcon size={24} className={`p-1 rounded-full ${moodColor} ${moodTextColor}`} />}
                    <span className="font-medium text-gray-700 dark:text-gray-300">{entry.mood}</span>
                  </div>
                  {entry.note && <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">"{entry.note}"</p>}
                   {/* Weather Snapshot (Check if weather exists) */}
                  {entry.weather && (
                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                        {WeatherIcon && <span className="flex items-center gap-1">{WeatherIcon} {entry.weather.description}</span>}
                        {/* Ensure weather properties exist before accessing */}
                        <span className="flex items-center gap-1"><WiThermometer />{entry.weather.temp !== undefined ? `${Math.round(entry.weather.temp)}°C` : 'N/A'}</span>
                        <span className="flex items-center gap-1"><WiHumidity />{entry.weather.humidity !== undefined ? `${entry.weather.humidity}%` : 'N/A'}</span>
                    </div>
                  )}
                  {!entry.weather && entry.date !== getFormattedDate() && (
                     <p className="mt-2 text-xs text-gray-400 italic">(Weather only recorded for entries made on the current day)</p>
                  )}
                </div>
                 <button
                    // Pass entry.id and entry.date to handleDelete
                    onClick={() => handleDelete(entry.id, entry.date)}
                    className="p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    aria-label={`Delete entry from ${getDisplayDate(entry.date)}`}
                 >
                    <FiTrash2 size={18} />
                 </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CalendarView;