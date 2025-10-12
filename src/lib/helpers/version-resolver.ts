import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Кэш для версии пакета */
let cachedVersion: string | null = null;

/** Читает версию из package.json как единый источник правды */
export function getPackageVersion(): string {
    if (cachedVersion !== null) {
        return cachedVersion;
    }

    try {
        const packageJsonPath = resolve(__dirname, '../../../package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { version: string };
        cachedVersion = packageJson.version || '2.0.0';

        return cachedVersion;
    } catch {
        cachedVersion = '2.0.0'; // Fallback версия

        return cachedVersion;
    }
}

/** Сбрасывает кэш версии (для тестов) */
export function resetVersionCache(): void {
    cachedVersion = null;
}
