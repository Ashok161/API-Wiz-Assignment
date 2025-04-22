import React, { useContext } from 'react';
import { EntriesContext } from '../contexts/EntriesContext';
import { generateCsvContent, downloadCsv } from '../utils/csvGenerator';
// Make sure both PDF generation functions are imported from your utils file
import { generateSimplePdf, generatePdfFromHtml } from '../utils/pdfGenerator';
import { FiDownload, FiFileText, FiImage } from 'react-icons/fi'; // Icons for buttons


const ExportButtons = () => {
  const { entries } = useContext(EntriesContext);

  const handleCsvExport = () => {
    if (entries.length === 0) {
      alert("No entries to export.");
      return;
    }
    const csvContent = generateCsvContent(entries);
    // Generate filename with current date
    const filename = `mood-journal-csv-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCsv(csvContent, filename);
  };

  const handleSimplePdfExport = () => {
     if (entries.length === 0) {
       alert("No entries to export.");
       return;
     }
    // Generate filename with current date
    const filename = `mood-journal-text-${new Date().toISOString().split('T')[0]}.pdf`;
    generateSimplePdf(entries, filename);
  };

  // *** MODIFICATION START ***
  // Updated handler for Visual PDF Export
  const handleVisualPdfExport = () => {
     if (entries.length === 0) {
       alert("No entries to export.");
       return;
     }
     // Target ID must match the ID set in CalendarView.jsx
     const targetElementId = 'journal-entries-container';
     const targetElement = document.getElementById(targetElementId);

     if (!targetElement) {
          // Show an error if the element couldn't be found
          alert(`Error: Could not find the element with ID '${targetElementId}' to generate the PDF from. Make sure the ID is correctly set in CalendarView.jsx.`);
          return; // Stop the function
     }

     // Generate filename with current date
     const filename = `mood-journal-visual-${new Date().toISOString().split('T')[0]}.pdf`;
     // Call the utility function to generate PDF from the found element
     generatePdfFromHtml(targetElementId, filename);
   };
   // *** MODIFICATION END ***

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {/* CSV Button */}
      <button
        onClick={handleCsvExport}
        disabled={entries.length === 0}
        className="flex items-center justify-center gap-2 px-4 py-2 border border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 rounded-md shadow-sm text-sm font-medium hover:bg-green-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
      >
        <FiDownload /> Export as CSV
      </button>

      {/* Text PDF Button */}
      <button
        onClick={handleSimplePdfExport}
        disabled={entries.length === 0}
        className="flex items-center justify-center gap-2 px-4 py-2 border border-red-500 text-red-600 dark:border-red-400 dark:text-red-400 rounded-md shadow-sm text-sm font-medium hover:bg-red-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
      >
        <FiFileText /> Export Text PDF
      </button>

      {/* *** MODIFICATION START *** */}
      {/* Visual PDF Button (Uncommented) */}
      <button
        onClick={handleVisualPdfExport}
        disabled={entries.length === 0}
        className="flex items-center justify-center gap-2 px-4 py-2 border border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400 rounded-md shadow-sm text-sm font-medium hover:bg-purple-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
      >
        <FiImage /> Export Visual PDF
      </button>
      {/* *** MODIFICATION END *** */}
    </div>
  );
};

export default ExportButtons;