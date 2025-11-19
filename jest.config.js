module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
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
        testMapper: (testResult, testCase) => ({
          fullName: testCase.fullName,
          title: testCase.title,
          labels: [
            {
              name: 'suite',
              value:
                testResult.testFilePath.split('/').pop()?.replace('.test.ts', '') || 'API Tests',
            },
            {
              name: 'epic',
              value: 'API Testing',
            },
            {
              name: 'feature',
              value: 'Mock API Server',
            },
          ],
        }),
      },
    ],
  ],
};
