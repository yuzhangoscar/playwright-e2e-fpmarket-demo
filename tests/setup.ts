// Jest setup file for API tests
import { jest } from '@jest/globals';

// Increase timeout for integration tests
jest.setTimeout(10000);

// Suppress console logs during tests unless debugging
if (!process.env.DEBUG_TESTS) {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
}

// Global test environment setup
beforeAll(async () => {
  // Any global setup can go here
});

afterAll(async () => {
  // Any global cleanup can go here
});

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Let the OS assign a random port for testing
