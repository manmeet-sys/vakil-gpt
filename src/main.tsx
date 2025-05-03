
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enable React 18's new concurrent features
const enableConcurrentFeatures = true;

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
        animation: fadeIn 0.5s ease-in;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
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
      .progress-bar {
        width: 150px;
        height: 4px;
        background-color: rgba(59, 130, 246, 0.2);
        border-radius: 2px;
        margin-top: 12px;
        overflow: hidden;
        position: relative;
      }
      .progress-value {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: #3b82f6;
        border-radius: 2px;
        width: 0%;
        animation: progress 2s ease-out forwards;
      }
      @keyframes progress {
        0% { width: 0; }
        50% { width: 70%; }
        100% { width: 100%; }
      }
    </style>
    <div>
      <div class="spinner"></div>
      <div class="app-loading-text">Loading VakilGPT...</div>
      <div class="progress-bar">
        <div class="progress-value"></div>
      </div>
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
      if (document.body.contains(loadingElement)) {
        document.body.removeChild(loadingElement);
      }
    }, 300);
  }
};

// Optimize font loading
const optimizeFonts = () => {
  // Add font preloading
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.href = '/fonts/inter-var-latin.woff2';
  fontPreload.as = 'font';
  fontPreload.type = 'font/woff2';
  fontPreload.crossOrigin = 'anonymous';
  document.head.appendChild(fontPreload);
};

// Optimize initial resources
const optimizeResources = () => {
  // Preload critical assets
  const criticalAssets = [
    '/favicon.ico',
  ];
  
  criticalAssets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset;
    link.as = asset.endsWith('.css') ? 'style' : 'image';
    document.head.appendChild(link);
  });
};

// Show loading indicator first
showLoadingIndicator();

// Optimize resources
optimizeFonts();
optimizeResources();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

// Track when the app is actually rendered and interactive
let appRendered = false;
let timeoutId: number | undefined;

// Create a performance observer to monitor LCP
if (typeof PerformanceObserver === 'function') {
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    if (entries.length > 0) {
      if (appRendered) {
        hideLoadingIndicator();
      } else {
        // LCP occurred but app not rendered yet, give it a bit more time
        timeoutId = window.setTimeout(hideLoadingIndicator, 300);
      }
    }
  });
  
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Mark app as rendered
appRendered = true;

// Hide loading indicator after the app has been rendered
window.addEventListener('load', () => {
  if (timeoutId) window.clearTimeout(timeoutId);
  
  const minDelay = 600; // Minimum time to show the loading indicator
  const startTime = performance.now();
  const timeElapsed = performance.now() - startTime;
  
  if (timeElapsed < minDelay) {
    // Ensure loading indicator shows for at least minDelay ms
    setTimeout(hideLoadingIndicator, minDelay - timeElapsed);
  } else {
    hideLoadingIndicator();
  }
});

// Add lightweight performance monitoring
window.addEventListener('DOMContentLoaded', () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // Log important metrics
        if (entry.entryType === 'largest-contentful-paint' || 
            entry.entryType === 'first-input' || 
            entry.entryType === 'layout-shift') {
          console.info(`[Performance] ${entry.entryType}:`, entry);
        }
      });
    });
    
    // Observe important performance metrics
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    observer.observe({ type: 'first-input', buffered: true });
    observer.observe({ type: 'layout-shift', buffered: true });
  }
});

// Preload routes based on user navigation patterns
const preloadRoutes = () => {
  // Only preload after the main content is loaded
  window.addEventListener('load', () => {
    // Wait a bit to ensure main content is handled first
    setTimeout(() => {
      // Preload common routes when user is idle
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          const commonRoutes = [
            '/tools',
            '/legal-document-drafting',
            '/sentencing-predictor',
          ];
          
          commonRoutes.forEach(route => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            link.as = 'document';
            document.head.appendChild(link);
          });
        });
      }
    }, 2000);
  });
};

preloadRoutes();
