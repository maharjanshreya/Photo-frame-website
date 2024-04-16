// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import 'jest-canvas-mock';
import '@testing-library/jest-dom';
class MockIntersectionObserver {
    constructor(callback, options) {}
    observe() {
      // Do nothing
    }
    unobserve() {
      // Do nothing
    }
    disconnect() {
      // Do nothing
    }
  }
  
  // Assign the mock IntersectionObserver to the window object
  window.IntersectionObserver = MockIntersectionObserver;