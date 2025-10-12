import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { APP_CONFIG, getAppConfigError } from '../../../model/config';
import type { ResourceResolver, ValidationType } from './types';

/** Получает путь к Node.js из конфигурации */
function getRuntimeNodePath(): string {
    const config = APP_CONFIG;
    const configError = getAppConfigError();

    return !config || configError ? '' : config.runtime.nodePath;
}

/** Проверяет является ли путь корнем пакета */
function isPackageRoot(path: string): boolean {
    try {
        const packageJson = JSON.parse(readFileSync(join(path, 'package.json'), 'utf8')) as { name?: string };

        return packageJson.name === '@morj/tools.mcp-validator';
    } catch {
        return false;
    }
}

/** Получает путь к корню пакета из текущего модуля с dual-mode поддержкой */
function getPackageRoot(): string {
    const currentFilePath = fileURLToPath(import.meta.url);
    let searchDir = dirname(currentFilePath);

    while (searchDir !== dirname(searchDir)) {
        if (isPackageRoot(searchDir)) {
            return searchDir;
        }
        searchDir = dirname(searchDir);
    }

    const installedPaths = [
        resolve(process.cwd(), 'node_modules/@morj/tools.mcp-validator'),
        resolve(getRuntimeNodePath(), '@morj/tools.mcp-validator'),
        resolve(dirname(currentFilePath), '../../../../../'),
    ];

    for (const candidatePath of installedPaths) {
        if (isPackageRoot(candidatePath)) {
            return candidatePath;
        }
    }

    return join(dirname(currentFilePath), '../../../..');
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
