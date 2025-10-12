import type { Linter } from 'eslint';
import { configs } from 'eslint-walrus-config';
import { dirname } from 'node:path';

export const baseConfig = [
    ...configs.ignores,
    ...configs.createMainConfig({
        rootDir: dirname(new URL(import.meta.url).pathname),
    }),
    {},
] satisfies Linter.Config[];

export default baseConfig;
