import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_CONFIG, getAppConfigError } from '../../../model/config';
import type { ResourceResolver, ValidationType } from './types';

function getRuntimeNodePath(): string {
    const config = APP_CONFIG;

    const configError = getAppConfigError();

    if (!config || configError) {
        return '';
    }

    return config.runtime.nodePath;
}

/** Получает путь к корню пакета из текущего модуля с dual-mode поддержкой */
function getPackageRoot(): string {
    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);

    // РЕЖИМ 1: Development (yarn workspace) - поиск вверх по дереву
    let searchDir = dirname(currentFilePath);
    while (searchDir !== dirname(searchDir)) {
        try {
            const packageJsonPath = join(searchDir, 'package.json');
            if (existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { name?: string };
                if (packageJson.name === '@morj/tools.mcp-validator') {
                    return searchDir;
                }
            }
        } catch {
            // Продолжаем поиск выше
        }
        searchDir = dirname(searchDir);
    }

    // РЕЖИМ 2: Installed (npm install -g) - поиск в node_modules
    const installedPaths = [
        // Локальные node_modules (проект использует пакет)
        resolve(process.cwd(), 'node_modules/@morj/tools.mcp-validator'),
        // Глобальные node_modules (npm install -g)
        resolve(getRuntimeNodePath(), '@morj/tools.mcp-validator'),
        // Relative к текущему файлу в установленном пакете
        resolve(dirname(currentFilePath), '../../../../../'),
    ];

    for (const candidatePath of installedPaths) {
        try {
            const packageJsonPath = join(candidatePath, 'package.json');
            if (existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { name?: string };
                if (packageJson.name === '@morj/tools.mcp-validator') {
                    return candidatePath;
                }
            }
        } catch {
            // Продолжаем поиск
        }
    }

    // Fallback к оригинальному относительному пути если поиск не удался
    const currentDir = dirname(currentFilePath);

    return join(currentDir, '../../../..');
}

/** Создает resolver для ресурсов пакета */
export function getPackageResourceResolver(): ResourceResolver {
    const packageRoot = getPackageRoot();

    return {
        resolveAnalyzeTestPromptPath: (): string => join(packageRoot, 'prompts', 'testing', 'test-prompt.md'),

        resolveErrorTemplatePath: (errorType: string): string =>
            join(packageRoot, 'prompts', 'errors', `${errorType}.md`),

        resolveErrorTemplatesDir: (): string => join(packageRoot, 'prompts', 'errors'),

        resolveExecuteTestPromptPath: (): string => join(packageRoot, 'prompts', 'testing', 'execute-prompt-test.md'),

        resolvePackageJsonPath: (): string => join(packageRoot, 'package.json'),

        resolvePromptPath: (type: ValidationType): string =>
            join(packageRoot, 'prompts', 'validation', `validate-${type}.md`),
    };
}
