import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PACKAGE_RESOURCE_PATHS } from '../constants/main';
import { appConfigSchema } from '../schemas/main';
import type { AppConfig } from '../types/main';

/** Получает путь к корню пакета */
function getPackageRoot(): string {
    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);
    const currentDir = dirname(currentFilePath);

    return join(currentDir, '../../..');
}

/** Формирует конфигурацию приложения из переменных окружения */
export function createAppConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
    const packageRoot = getPackageRoot();

    const rawConfig = {
        ai: {
            defaultModel: env.DEFAULT_AI_MODEL,
            maxTokens: env.AI_MAX_TOKENS,
            temperature: env.AI_TEMPERATURE,
        },
        logging: {
            level: env.LOG_LEVEL,
        },
        openRouter: {
            apiKey: env.OPENROUTER_API_KEY,
            apiUrl: env.OPENROUTER_API_URL,
            mockClientPath: env.OPENROUTER_MOCK_CLIENT_PATH,
            timeout: env.OPENROUTER_TIMEOUT,
        },
        paths: {
            errors: join(packageRoot, PACKAGE_RESOURCE_PATHS.ERRORS),
            prompts: env.PROMPTS_PATH ? resolve(env.PROMPTS_PATH) : join(packageRoot, PACKAGE_RESOURCE_PATHS.PROMPTS),
        },
        runtime: {
            environment: env.NODE_ENV ?? 'development',
            isE2ETest: env.MCP_E2E_TEST === 'true',
            isTestMode: env.NODE_ENV === 'test' || env.MCP_E2E_TEST === 'true',
            nodePath: env.NODE_PATH || '',
        },
        validation: {
            timeout: env.VALIDATION_TIMEOUT,
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
