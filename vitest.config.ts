import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname =
    typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Vitest configuration for unit tests
// For Storybook tests, use: npm run test:storybook
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.tsx'],
        // include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        exclude: ['src/**/*.stories.{js,ts,jsx,tsx}'],
        projects: [
            {
                extends: true,
                plugins: [
                    // The plugin will run tests for the stories defined in your Storybook config
                    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                    storybookTest({
                        configDir: path.join(dirname, '.storybook'),
                    }),
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: 'playwright',
                        instances: [
                            {
                                browser: 'chromium',
                            },
                        ],
                    },
                    setupFiles: ['.storybook/vitest.setup.ts'],
                },
            },
            {
                extends: true,
                test: {
                    name: 'unit',
                    environment: 'jsdom',
                    setupFiles: ['./src/test/setup.tsx'],
                    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
                    exclude: ['src/**/*.stories.{js,ts,jsx,tsx}'],
                },
            },
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(dirname, './src'),
        },
    },
});
