import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getCachedName, setCachedName } from './reset-name-cache';

/** Читает имя из package.json как единый источник правды */
export function getPackageName(): string {
    const cachedName = getCachedName();
    if (cachedName !== null) {
        return cachedName;
    }

    try {
        const currentFileUrl = import.meta.url;
        const currentFilePath = fileURLToPath(currentFileUrl);
        const packageJsonPath = resolve(dirname(currentFilePath), '../../../package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { name: string };
        const name = packageJson.name || 'mcp-validator';
        setCachedName(name);

        return name;
    } catch {
        const fallbackName = 'mcp-validator';
        setCachedName(fallbackName);

        return fallbackName;
    }
}
