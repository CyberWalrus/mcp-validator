import { defineConfig } from 'vitest/config';

export default defineConfig({
    esbuild: {
        target: 'node20',
    },

    test: {
        coverage: {
            enabled: false,
            include: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/__tests__/**', '!src/e2e/**'],
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
            MCP_E2E_TEST: 'true',
            NODE_ENV: 'test',
            OPENROUTER_API_KEY: 'test-key-for-e2e',
        },
        globals: true,
        include: ['src/e2e/**/*.e2e.test.ts'],
        outputFile: {
            junit: './reports/e2e-junit.xml',
        },
        pool: 'forks',

        poolOptions: {
            forks: {
                maxForks: 3,
                minForks: 1,
                singleFork: false,
            },
        },
        reporters: ['verbose', 'junit'],
        testTimeout: 30000,
    },
});
