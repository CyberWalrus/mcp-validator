import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Получает путь к корню пакета */
export function getPackageRoot(): string {
    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);
    let searchDir = dirname(currentFilePath);

    while (searchDir !== dirname(searchDir)) {
        try {
            const packageJsonPath = join(searchDir, 'package.json');
            if (existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { name?: string };
                if (packageJson.name === 'mcp-validator') {
                    return searchDir;
                }
            }
            // eslint-disable-next-line no-empty
        } catch {}
        searchDir = dirname(searchDir);
    }

    return join(dirname(currentFilePath), '../../..');
}
