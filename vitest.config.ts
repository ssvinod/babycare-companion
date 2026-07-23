import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'scripts/test*.js',
      'scripts/**/*.test.js',
      'scripts/**/*.spec.js',
    ],
    exclude: [
      'node_modules',
      'dist',
      '**/*.disabled',
    ],
    globals: true,
    environment: 'node',
  },
});