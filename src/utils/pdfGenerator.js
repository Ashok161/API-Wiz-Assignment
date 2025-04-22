import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getDisplayDate } from './dateFormatter';
import { moodOptions } from '../components/MoodSelector'; // For mood colors potentially

// Simple PDF generation - creates a text-based PDF.
// For complex layouts with styling, html2canvas or more advanced PDF libraries are needed.

export const generateSimplePdf = (entries, filename = 'mood-journal.pdf') => {
  if (!entries || entries.length === 0) {
    alert("No entries to export.");
    return;
  }

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  let y = margin; // Start position for text

  // Title
  doc.setFontSize(18);
  doc.text('Mood Journal Entries', margin, y);
  y += 10; // Move down

  // Entries
  doc.setFontSize(10); // Smaller font for entries

  entries.forEach((entry, index) => {
    const entryHeight = 40; // Estimated height per entry, adjust as needed
    if (y + entryHeight > pageHeight - margin) { // Check if new page is needed
        doc.addPage();
        y = margin; // Reset y position
        doc.setFontSize(10); // Reset font size on new page
    }

    doc.setLineWidth(0.2);
    doc.line(margin, y - 2, doc.internal.pageSize.width - margin, y - 2); // Separator line

    doc.setFont(undefined, 'bold');
    doc.text(`Date: ${getDisplayDate(entry.date)}`, margin, y + 5);
    doc.setFont(undefined, 'normal');

    // Mood
    const moodInfo = moodOptions.find(m => m.mood === entry.mood);
    // Optionally set text color based on mood (requires RGB values)
    // doc.setTextColor(...); // Example: doc.setTextColor(255, 0, 0); for red
    doc.text(`Mood: ${entry.mood || 'N/A'}`, margin, y + 12);
    // doc.setTextColor(0, 0, 0); // Reset text color to black

    // Note
    if (entry.note) {
        // Handle potential long notes with splitTextToSize
        const noteLines = doc.splitTextToSize(`Note: ${entry.note}`, doc.internal.pageSize.width - margin * 2);
        doc.text(noteLines, margin, y + 19);
        y += noteLines.length * 4; // Adjust y based on number of lines
    } else {
        y += 5; // Adjust y even if no note
    }


    // Weather (Basic)
    if (entry.weather) {
      const weatherText = `Weather: ${entry.weather.description || 'N/A'} | Temp: ${Math.round(entry.weather.temp ?? 0)}°C | Feels Like: ${Math.round(entry.weather.feels_like ?? 0)}°C | Loc: ${entry.weather.locationName || 'N/A'}`;
      const weatherLines = doc.splitTextToSize(weatherText, doc.internal.pageSize.width - margin * 2);
       doc.text(weatherLines, margin, y + 19);
        y += weatherLines.length * 4 + 5; // Add spacing after weather
    } else {
       doc.text('Weather: N/A', margin, y + 19);
       y += 10; // Adjust y if no weather
    }

    y += 5; // Add buffer space before next entry line

  });


  // Save the PDF
  doc.save(filename);
};


// Alternative using html2canvas (more complex, captures visuals but can be imperfect)
export const generatePdfFromHtml = async (elementId, filename = 'mood-journal-visual.pdf') => {
    const input = document.getElementById(elementId);
    if (!input) {
        alert(`Element with ID ${elementId} not found for PDF export.`);
        return;
    }
    alert("Generating visual PDF... This might take a moment.");

    try {
        const canvas = await html2canvas(input, {
            scale: 2, // Increase scale for better resolution
            useCORS: true, // If using external images/icons
            logging: true, // Enable logging for debugging
             backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff', // Match bg
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px', // Use pixels to match canvas dimensions
            format: [canvas.width, canvas.height] // Set PDF size to canvas size
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(filename);
    } catch (error) {
        console.error("Error generating PDF with html2canvas:", error);
        alert("Failed to generate visual PDF. Please try the simple text export.");
    }
};