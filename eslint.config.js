module.exports = [
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      playwright: require('eslint-plugin-playwright'),
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/valid-expect': 'error',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'test-results/', 'playwright-report/', 'blob-report/'],
  },
];
