
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add loading indicator for initial app load
const showLoadingIndicator = () => {
  const loadingElement = document.createElement('div');
  loadingElement.id = 'app-loading-indicator';
  loadingElement.innerHTML = `
    <style>
      #app-loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f9fafb;
        z-index: 9999;
        transition: opacity 0.3s ease-out;
      }
      .dark #app-loading-indicator {
        background-color: #1f2937;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(45, 55, 72, 0.3);
        border-radius: 50%;
        border-top-color: #3b82f6;
        animation: spin 1s ease-in-out infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .app-loading-text {
        margin-top: 16px;
        font-family: system-ui, sans-serif;
        font-size: 16px;
        color: #4b5563;
      }
      .dark .app-loading-text {
        color: #d1d5db;
      }
    </style>
    <div>
      <div class="spinner"></div>
      <div class="app-loading-text">Loading VakilGPT...</div>
    </div>
  `;

  document.body.appendChild(loadingElement);

  // Check if dark mode is enabled
  const isDarkMode = window.localStorage.getItem('vakilgpt-theme') === 'dark' || 
    (!window.localStorage.getItem('vakilgpt-theme') && 
    window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  }
};

const hideLoadingIndicator = () => {
  const loadingElement = document.getElementById('app-loading-indicator');
  if (loadingElement) {
    loadingElement.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(loadingElement);
    }, 300);
  }
};

// Show loading indicator first
showLoadingIndicator();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hide loading indicator after the app has been rendered
window.addEventListener('load', () => {
  // Add a small delay to make sure the app is fully loaded
  setTimeout(hideLoadingIndicator, 500);
});
