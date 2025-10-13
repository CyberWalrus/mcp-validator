import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getCachedVersion, setCachedVersion } from './reset-version-cache';

/** Читает версию из package.json как единый источник правды */
export function getPackageVersion(): string {
    const cachedVersion = getCachedVersion();
    if (cachedVersion !== null) {
        return cachedVersion;
    }

    try {
        const currentFileUrl = import.meta.url;
        const currentFilePath = fileURLToPath(currentFileUrl);
        const packageJsonPath = resolve(dirname(currentFilePath), '../../../package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { version: string };
        const version = packageJson.version || '0.3.0';
        setCachedVersion(version);

        return version;
    } catch {
        const fallbackVersion = '0.3.0';
        setCachedVersion(fallbackVersion);

        return fallbackVersion;
    }
}
