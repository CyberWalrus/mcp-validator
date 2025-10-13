import { defineConfig } from 'vitest/config';

/** Конфигурация Vitest для e2e-тестов в CI */
export default defineConfig({
    esbuild: {
        target: 'node20',
    },

    test: {
        coverage: {
            enabled: false,
            include: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/__tests__/**'],
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage/e2e',
            thresholds: {
                global: {
                    branches: 60,
                    functions: 60,
                    lines: 60,
                    statements: 60,
                },
            },
        },
        env: {
            API_KEY: 'test-key-for-e2e',
            MCP_E2E_TEST: 'true',
            NODE_ENV: 'test',
        },
        globals: true,
        include: ['end-to-end/**/*.e2e.test.ts'],
        outputFile: {
            junit: './reports/e2e-junit.xml',
        },
        // Отключаем параллельное выполнение в CI для стабильности
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: true,
            },
        },
        reporters: ['verbose', 'junit'],
        testTimeout: 60000, // Увеличиваем timeout для CI
        // Увеличиваем timeout для всего тестового набора
        hookTimeout: 60000,
        teardownTimeout: 60000,
    },
});
