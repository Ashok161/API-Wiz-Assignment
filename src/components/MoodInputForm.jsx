import React, { useState, useEffect, useContext } from 'react';
import MoodSelector, { moodOptions } from './MoodSelector';
import WeatherDisplay from './WeatherDisplay';
import { fetchWeatherByCoords } from '../services/weatherService';
import { EntriesContext } from '../contexts/EntriesContext';
import { getFormattedDate, getDisplayDate } from '../utils/dateFormatter';

// Define Hyderabad coordinates
const HYDERABAD_COORDS = { latitude: 17.3850, longitude: 78.4867 };

const MoodInputForm = () => {
  const todayDate = getFormattedDate(); // Get today's date in YYYY-MM-DD format

  // State for the selected date, defaults to today
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const displayDate = getDisplayDate(selectedDate); // User-friendly display for the selected date

  const { addEntry, entries } = useContext(EntriesContext);
  // Find *an* entry for the selected date (if multiple, could refine this later)
  // For now, this might not be very useful if we allow multiple entries per day
  // const entryForSelectedDate = entries.find(e => e.date === selectedDate);

  // Initialize state based on selectedDate (could load last entry for that day? For now, start fresh)
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [weatherData, setWeatherData] = useState(null); // Weather specific to selected date
  const [location, setLocation] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isToday, setIsToday] = useState(selectedDate === todayDate);

  // Update isToday state and reset weather when selectedDate changes
  useEffect(() => {
    setIsToday(selectedDate === todayDate);
    setWeatherData(null); // Reset weather when date changes
    setLocation(null); // Reset location
    setWeatherError(null); // Clear weather errors
    setIsLoadingWeather(false); // Reset loading state
    // Reset form fields when date changes? Optional, could be user preference.
    // setSelectedMood('');
    // setNote('');
  }, [selectedDate, todayDate]);

  // --- Geolocation (Only if selectedDate is Today) ---
  useEffect(() => {
    // Only run geolocation if the selected date is today and we don't have location yet
    if (!isToday || location) {
      // If not today, clear any previous weather attempts
      if (!isToday) {
         setWeatherData(null);
         setLocation(null);
         setWeatherError(null);
         setIsLoadingWeather(false);
      }
      return;
    }

    // Check if there's already an entry for today with weather saved
    const todaysEntryWithWeather = entries.find(e => e.date === todayDate && e.weather);
    if (todaysEntryWithWeather) {
         setWeatherData(todaysEntryWithWeather.weather); // Use saved weather
         return; // Don't fetch again
    }

    // 1. Check if the Geolocation API is supported
    if (!navigator.geolocation) {
      setWeatherError("Geolocation not supported. Fetching weather for Hyderabad.");
      setLocation(HYDERABAD_COORDS); // Fallback
      return; // Stop if not supported
    }

    setIsLoadingWeather(true);
    setWeatherError(null);

    // 2. Call getCurrentPosition with success and error handlers
    navigator.geolocation.getCurrentPosition(
      // Success Callback (handleSuccess)
      (position) => {
        // Set the location state with coordinates
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        // Weather fetch is triggered by the location state update in another useEffect
      },
      // Error Callback (handleError)
      (error) => {
        console.error("Geolocation error:", error);
        setWeatherError(`Unable to retrieve location: ${error.message}. Fetching weather for Hyderabad.`);
        setLocation(HYDERABAD_COORDS); // Fallback on error
      },
      // Options
      { timeout: 10000 }
    );
    // NOTE: The browser asks for permission when the line above is executed

  }, [isToday, location, entries, todayDate]); // Dependencies for the effect


  // --- Fetch Weather (Only if selectedDate is Today and location is available) ---
  useEffect(() => {
     // Only fetch if it's today, we have a location, and weatherData is not already set
    if (isToday && location && !weatherData) {
      const fetchWeather = async () => {
        setIsLoadingWeather(true);
        setWeatherError(null);
        console.log(`Fetching weather for coords:`, location);
        try {
          const data = await fetchWeatherByCoords(location.latitude, location.longitude);
          console.log('Weather API Response:', data);
          if (data && data.main && data.weather && data.weather.length > 0) {
              // Store simplified weather data structure
              setWeatherData({
                temp: data.main.temp,
                feels_like: data.main.feels_like,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                locationName: data.name || 'Unknown Location',
                humidity: data.main.humidity,
                windSpeed: data.wind?.speed,
              });
          } else {
             console.error("Incomplete weather data received:", data);
             setWeatherError("Received incomplete weather data from API.");
          }
        } catch (error) {
          console.error("Weather fetch error:", error);
           if (error.response && error.response.status === 401) {
             setWeatherError("Invalid API Key. Please check your .env file.");
           } else if (error.message === "API Key missing") {
             setWeatherError("OpenWeatherMap API Key not configured.");
           } else {
             setWeatherError("Could not fetch weather data. Check network or API status.");
           }
           setWeatherData(null);
        } finally {
          setIsLoadingWeather(false);
        }
      };
      fetchWeather();
    }
  // Depend on isToday, location, and weatherData state
  }, [isToday, location, weatherData]);


  // --- Form Submission ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setSaveMessage('');

    if (!selectedMood) {
      setFormError('Please select a mood.');
      return;
    }

    setIsSaving(true);
    const newEntry = {
      // id will be added by addEntry in context
      date: selectedDate, // Use the selected date
      mood: selectedMood,
      note: note.trim(),
      // Include weather only if it was fetched (i.e., if it was today)
      weather: isToday ? weatherData : null
    };

    try {
        addEntry(newEntry);
        setSaveMessage('Entry saved successfully!');
        // Clear form after successful save?
        setSelectedMood('');
        setNote('');
        // Don't reset date, user might want to add another entry for the same day
        setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
        console.error("Error saving entry:", error);
        setFormError('Failed to save entry. Please try again.');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className={`p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}>
      <form onSubmit={handleSubmit} className="space-y-5">
         {/* Date Selection Input */}
        <div className="flex flex-col items-center">
             <label htmlFor="entryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Entry Date:
             </label>
             <input
                type="date"
                id="entryDate"
                value={selectedDate} // Controlled input using selectedDate state
                onChange={(e) => setSelectedDate(e.target.value)} // Update state on change
                max={todayDate} // Optional: Prevent selecting future dates
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
             />
              {/* Display user-friendly date below input */}
              <p className="text-center font-semibold text-lg mt-2">{displayDate}</p>
         </div>


        {/* Weather Display (Only show if it's today) */}
        {isToday && (
            <WeatherDisplay
             // Pass weather data in the structure WeatherDisplay expects
             weatherData={weatherData ? {
                name: weatherData.locationName,
                main: { temp: weatherData.temp, feels_like: weatherData.feels_like, humidity: weatherData.humidity },
                weather: [{ description: weatherData.description, icon: weatherData.icon }],
                wind: { speed: weatherData.windSpeed }
             } : null}
             isLoading={isLoadingWeather}
             error={weatherError}
            />
        )}
        {!isToday && (
            <div className="text-center p-4 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                Weather is only available for today's entry.
            </div>
        )}


        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">Select your mood:</label>
          <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
        </div>

        {/* Note Input */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add a note (optional):</label>
          <textarea
            id="note"
            name="note"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
            placeholder="What's on your mind?"
          ></textarea>
        </div>

        {/* Error & Save Messages */}
        {formError && <p className="text-red-600 dark:text-red-400 text-sm text-center">{formError}</p>}
        {saveMessage && <p className="text-green-600 dark:text-green-400 text-sm text-center">{saveMessage}</p>}


        {/* Submit Button */}
        <button
          type="submit"
          // Disable submit if weather is loading *and* it's today, or if saving
          disabled={(isToday && isLoadingWeather) || isSaving}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
             bg-blue-600 hover:bg-blue-700
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
             disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out`}
        >
          {/* Adjust button text slightly */}
          {isSaving ? 'Saving...' : `Save Entry for ${getDisplayDate(selectedDate)}`}
        </button>
      </form>
    </div>
  );
};

export default MoodInputForm;