module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\.ts$': 'ts-jest',
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage-api',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
  verbose: true,
  reporters: [
    'default',
    [
      'jest-allure2-reporter',
      {
        resultsDir: './allure-results-api',
        labels: {
          package: 'API Tests',
          testClass: 'Jest API Tests',
          testMethod: '{{testTitle}}',
          parentSuite: 'Mock API Server',
          suite: '{{ancestorTitles}}',
          subSuite: '{{title}}',
        },
      },
    ],
  ],
};
