import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize theme from localStorage
const stored = localStorage.getItem('hackshield-theme');
const parsed = stored ? JSON.parse(stored) : null;
const isDark = parsed?.state?.isDark !== false;
if (isDark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
