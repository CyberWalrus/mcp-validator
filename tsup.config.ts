import { defineConfig } from 'tsup';

export default defineConfig({
    bundle: true,
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    esbuildOptions(options) {
        options.banner = {
            js: '#!/usr/bin/env node',
        };
    },
    external: ['@modelcontextprotocol/sdk', 'openai', 'zod'],
    format: ['esm'],
    outDir: 'lib',
    outExtension: () => ({ dts: '.d.ts', js: '.js' }),
    splitting: false,
    target: 'node20',
});
