import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PACKAGE_RESOURCE_PATHS } from '../constants/main';
import { appConfigSchema } from '../schemas/main';
import type { AppConfig } from '../types/main';

/** Получает путь к корню пакета */
function getPackageRoot(): string {
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

/** Формирует конфигурацию приложения из переменных окружения */
export function createAppConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
    const packageRoot = getPackageRoot();

    const rawConfig = {
        api: {
            key: env.API_KEY,
            mockClientPath: env.API_MOCK_CLIENT_PATH,
            provider: 'openrouter' as const,
            url: env.API_URL,
        },
        logging: {
            level: env.LOG_LEVEL,
        },
        model: {
            maxTokens: env.AI_MAX_TOKENS,
            name: env.AI_MODEL,
            temperature: env.AI_TEMPERATURE,
        },
        paths: {
            errors: join(packageRoot, PACKAGE_RESOURCE_PATHS.ERRORS),
            prompts: env.PROMPTS_PATH ? resolve(env.PROMPTS_PATH) : join(packageRoot, PACKAGE_RESOURCE_PATHS.PROMPTS),
        },
        runtime: {
            environment: env.NODE_ENV ?? 'development',
            isE2ETest: env.MCP_E2E_TEST === 'true',
            nodePath: env.NODE_PATH || '',
        },
        timeouts: {
            apiRequest: env.TIMEOUT_API_REQUEST,
            validation: env.TIMEOUT_VALIDATION,
        },
    };

    try {
        return appConfigSchema.parse(rawConfig);
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'issues' in error && Array.isArray(error.issues)) {
            const firstIssue = error.issues[0] as { message?: string };
            if (firstIssue && typeof firstIssue.message === 'string') {
                throw new Error(firstIssue.message);
            }
        }

        if (error instanceof Error) {
            throw new Error(`Configuration validation failed: ${error.message}`);
        }
        throw error;
    }
}
