import React, { useContext } from 'react';
import MoodInputForm from './components/MoodInputForm';
import CalendarView from './components/CalendarView';
import MoodChart from './components/MoodChart';
import ExportButtons from './components/ExportButtons';
import DarkModeToggle from './components/DarkModeToggle';
import { ThemeContext } from './contexts/ThemeContext';

function App() {
  const { theme } = useContext(ThemeContext);

  // Apply theme class to the root HTML element
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
          Mood Journal
        </h1>
        <DarkModeToggle />
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input and Chart */}
        <div className="lg:col-span-1 space-y-8">
          <section aria-labelledby="mood-input-heading">
             <h2 id="mood-input-heading" className="text-xl font-semibold mb-4">How are you feeling today?</h2>
             <MoodInputForm />
          </section>
          <section aria-labelledby="mood-chart-heading">
             <h2 id="mood-chart-heading" className="text-xl font-semibold mb-4">Mood Trends</h2>
             <MoodChart />
          </section>
          <section aria-labelledby="export-heading">
             <h2 id="export-heading" className="text-xl font-semibold mb-4">Export Your Journal</h2>
             <ExportButtons />
          </section>
        </div>

        {/* Right Column: Calendar/History */}
        <div className="lg:col-span-2">
           <section aria-labelledby="journal-history-heading">
             <h2 id="journal-history-heading" className="text-xl font-semibold mb-4">Journal History</h2>
             <CalendarView />
          </section>
        </div>
      </main>

      <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
        Created for APIWIZ Assessment
      </footer>
    </div>
  );
}

export default App;