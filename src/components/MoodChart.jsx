import React, { useContext, useMemo } from 'react';
import { EntriesContext } from '../contexts/EntriesContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, // Import TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import the adapter
import { moodOptions } from './MoodSelector';
import { parseISO } from 'date-fns'; // To parse YYYY-MM-DD

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale, // Register TimeScale
  Title,
  Tooltip,
  Legend
);

// Assign numerical values to moods for charting (adjust as needed)
const moodValues = {
  'Happy': 5,
  'Content': 4,
  'Neutral': 3,
  'Sad': 2,
  'Angry': 1,
};


const MoodChart = () => {
  const { entries } = useContext(EntriesContext);

  // Memoize processed data to avoid recalculation on every render
  const chartData = useMemo(() => {
      if (!entries || entries.length < 2) { // Need at least 2 points for a line
        return null;
      }

      // Sort entries by date ascending for the chart
      const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));

      // Map entries to chart data points {x: date, y: moodValue}
      const dataPoints = sortedEntries.map(entry => ({
          x: parseISO(entry.date), // Use parsed date object for time scale
          y: moodValues[entry.mood] || 0 // Use numerical value, default to 0 if mood not found
      }));

      // Find mood color based on mood name
      const getMoodColor = (moodName) => {
          const mood = moodOptions.find(m => m.mood === moodName);
          // Convert Tailwind color to hex/rgb if needed, or use a simpler mapping
          // For simplicity, let's use predefined chart colors or just one color
          // Example: return mood ? mood.chartColorHex || '#3b82f6' : '#3b82f6';
          return '#3b82f6'; // Default blue
      };

      return {
        datasets: [
          {
            label: 'Mood Level (1=Angry, 5=Happy)',
            data: dataPoints,
            fill: false,
            borderColor: '#3b82f6', // Example blue color
            tension: 0.1, // Slight curve to the line
            pointBackgroundColor: dataPoints.map(dp => getMoodColor( // Color points based on mood
                sortedEntries.find(e => parseISO(e.date).getTime() === dp.x.getTime())?.mood
            )),
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      };
  }, [entries]);

   // --- Chart Options ---
   const chartOptions = useMemo(() => ({
      responsive: true,
      maintainAspectRatio: false, // Allow chart to fill container height
      plugins: {
          legend: {
              position: 'top',
              labels: {
                color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151', // Adjust legend text color for dark/light mode
              }
          },
          title: {
              display: true,
              text: 'Mood Over Time',
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151', // Adjust title color
          },
          tooltip: {
              callbacks: {
                  // Custom tooltip label to show mood name
                  label: function(context) {
                      const entryIndex = context.dataIndex;
                      const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
                      const moodName = sortedEntries[entryIndex]?.mood || 'Unknown';
                      return `${moodName} (${context.parsed.y})`;
                  }
              }
          }
      },
      scales: {
          x: {
              type: 'time', // Use time scale
              time: {
                unit: 'day', // Display ticks per day
                 tooltipFormat: 'MMM dd, yyyy', // Format for tooltip
                 displayFormats: {
                     day: 'MMM dd' // Format for axis labels
                 }
              },
              title: {
                  display: true,
                  text: 'Date',
                  color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563',
              },
              ticks: {
                  color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563', // Adjust tick color
              },
              grid: {
                 color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              }
          },
          y: {
              beginAtZero: false, // Start scale based on data range
              min: 1,
              max: 5,
              ticks: {
                 stepSize: 1, // Show ticks for each mood level
                 color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563', // Adjust tick color
                 // Optional: Display mood names instead of numbers
                 callback: function(value, index, values) {
                     const moodName = Object.keys(moodValues).find(key => moodValues[key] === value);
                     return moodName || value;
                 }
              },
              title: {
                  display: true,
                  text: 'Mood Level',
                   color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563',
              },
              grid: {
                  color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              }
          }
      }
  }), [entries]); // Recalculate options if entries change (mainly for tooltip data access)


  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-64 sm:h-80"> {/* Set a fixed height */}
      {chartData ? (
        <Line options={chartOptions} data={chartData} />
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
          Not enough data to display the mood trend. Add at least two entries.
        </p>
      )}
    </div>
  );
};

export default MoodChart;