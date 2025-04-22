import React from 'react';
import {
  FaRegGrinBeam, // Happy
  FaRegSmile,    // Content
  FaRegMeh,      // Neutral
  FaRegFrown,    // Sad
  FaRegAngry,    // Angry
  // Add more icons as needed
} from 'react-icons/fa';

export const moodOptions = [
  { mood: 'Happy', icon: FaRegGrinBeam, color: 'bg-yellow-400', textColor: 'text-yellow-800' },
  { mood: 'Content', icon: FaRegSmile, color: 'bg-green-400', textColor: 'text-green-800' },
  { mood: 'Neutral', icon: FaRegMeh, color: 'bg-blue-400', textColor: 'text-blue-800' },
  { mood: 'Sad', icon: FaRegFrown, color: 'bg-indigo-400', textColor: 'text-indigo-800' },
  { mood: 'Angry', icon: FaRegAngry, color: 'bg-red-500', textColor: 'text-red-100' },
];

const MoodSelector = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="flex justify-around items-center space-x-2 sm:space-x-3 mb-4">
      {moodOptions.map(({ mood, icon: Icon, color }) => (
        <button
          key={mood}
          type="button" // Prevent form submission
          onClick={() => onSelectMood(mood)}
          className={`
            p-3 rounded-full transition-all duration-200 ease-in-out
            flex flex-col items-center space-y-1
            ${selectedMood === mood
              ? `${color} ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-blue-500 dark:ring-blue-400 scale-110`
              : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
            }
          `}
          aria-label={`Select mood: ${mood}`}
          aria-pressed={selectedMood === mood}
        >
          <Icon size={28} className={selectedMood === mood ? 'text-white' : 'text-gray-700 dark:text-gray-300'} />
          <span className={`text-xs font-medium ${selectedMood === mood ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{mood}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;