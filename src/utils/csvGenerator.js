import { getDisplayDate } from './dateFormatter';

// Function to safely access nested properties
const getSafe = (fn, defaultValue = 'N/A') => {
    try {
        return fn() ?? defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

export const generateCsvContent = (entries) => {
  if (!entries || entries.length === 0) {
    return '';
  }

  // Define headers
  const headers = [
    'Date',
    'Mood',
    'Note',
    'Weather Temp (°C)',
    'Weather Feels Like (°C)',
    'Weather Description',
    'Weather Location',
    'Weather Humidity (%)',
    'Weather Wind Speed (m/s)',
  ];

  // Convert entries data to rows
  const rows = entries.map(entry => {
    // Sanitize data for CSV (escape quotes and commas)
    const sanitize = (str) => {
      if (str === null || str === undefined) return '';
      const stringified = String(str);
      // If the string contains a comma, newline, or double quote, enclose it in double quotes
      if (stringified.includes(',') || stringified.includes('\n') || stringified.includes('"')) {
        // Escape existing double quotes by doubling them
        return `"${stringified.replace(/"/g, '""')}"`;
      }
      return stringified;
    };

    return [
      getDisplayDate(entry.date), // Use formatted date
      sanitize(entry.mood),
      sanitize(entry.note),
      getSafe(() => Math.round(entry.weather?.temp), 'N/A'),
      getSafe(() => Math.round(entry.weather?.feels_like), 'N/A'),
      sanitize(getSafe(() => entry.weather?.description)),
      sanitize(getSafe(() => entry.weather?.locationName)),
      getSafe(() => entry.weather?.humidity, 'N/A'),
      getSafe(() => entry.weather?.windSpeed, 'N/A'),
    ].join(','); // Join columns with a comma
  });

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n'); // Join rows with a newline
};

export const downloadCsv = (csvContent, filename = 'mood-journal.csv') => {
  if (!csvContent) return;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) { // Feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  } else {
      alert("CSV download is not supported in your browser.");
  }
};