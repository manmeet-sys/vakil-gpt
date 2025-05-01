
// Import jest-dom matchers
import '@testing-library/jest-dom';

// Mock window.matchMedia 
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
  
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
  takeRecords = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Silence the console error for ReactDOM.render deprecation
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};
