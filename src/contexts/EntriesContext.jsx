import React, { createContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const EntriesContext = createContext();

export const EntriesProvider = ({ children }) => {
  const [entries, setEntries] = useLocalStorage('moodEntries', []);

  const addEntry = (newEntry) => {
    // Each entry needs a unique ID. We'll use a timestamp.
    const entryWithId = { ...newEntry, id: Date.now() };

    setEntries((prevEntries) => {
      // Always add the new entry, don't check for existing date
      // Sort by timestamp descending (most recent first)
      // You could also sort primarily by date then timestamp if preferred
      return [...prevEntries, entryWithId].sort((a, b) => b.id - a.id);
    });
  };

   // Update deleteEntry to use the unique ID
   const deleteEntry = (idToDelete) => {
     setEntries((prevEntries) => prevEntries.filter(entry => entry.id !== idToDelete));
     console.log(`Attempting to delete entry with ID: ${idToDelete}`);
   };


  return (
    // Ensure deleteEntry using the ID is provided
    <EntriesContext.Provider value={{ entries, addEntry, deleteEntry }}>
      {children}
    </EntriesContext.Provider>
  );
};