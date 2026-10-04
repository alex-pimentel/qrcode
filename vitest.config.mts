import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['packages/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['packages/core/src/**/*.{ts,tsx}', 'packages/ui/src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        '**/*.d.ts',
        '**/node_modules/**',
        'packages/ui/src/index.ts',
      ],
      thresholds: {
        statements: 38,
        branches: 32,
        functions: 28,
        lines: 41,
      },
    },
  },
});
