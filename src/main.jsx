import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { EntriesProvider } from './contexts/EntriesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <EntriesProvider>
        <App />
      </EntriesProvider>
    </ThemeProvider>
  </React.StrictMode>,
)