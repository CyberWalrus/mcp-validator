import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            exclude: ['node_modules/', 'src/**/*.test.ts', 'src/**/*.d.ts'],
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            thresholds: {
                global: {
                    branches: 90,
                    functions: 90,
                    lines: 90,
                    statements: 90,
                },
            },
        },
        environment: 'node',
        exclude: ['node_modules', 'dist', '**/*.e2e.test.ts'],
        globals: true,
        include: ['src/**/*.test.ts'],
        setupFiles: ['src/test-setup.ts'],
    },
});
