import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PACKAGE_RESOURCE_PATHS } from '../constants/main';
import type { AppConfig } from '../types/main';
import { CACHED_CONFIG, CONFIG_STATE } from './config-constants';

/** Получает путь к корню пакета */
function getPackageRoot(): string {
    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);
    const currentDir = dirname(currentFilePath);

    return join(currentDir, '../../..');
}

/** Создает fallback конфигурацию приложения */
function createFallbackConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
    const packageRoot = getPackageRoot();

    return {
        ai: {
            defaultModel: 'openai/gpt-oss-120b',
            maxTokens: 100000,
            temperature: 0.5,
        },
        logging: {
            level: 'INFO',
        },
        openRouter: {
            apiKey: '',
            apiUrl: 'https://openrouter.ai/api/v1',
            mockClientPath: 'end-to-end/mocks/openrouter-test-client',
            timeout: 30000,
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
            timeout: 30000,
        },
    };
}

/** Присваивает значения конфигурации из источника в цель */
function assignConfig(target: AppConfig, source: AppConfig): void {
    Object.assign(target.ai, source.ai);
    Object.assign(target.logging, source.logging);
    Object.assign(target.openRouter, source.openRouter);
    Object.assign(target.paths, source.paths);
    Object.assign(target.runtime, source.runtime);
    Object.assign(target.validation, source.validation);
}

/** Преобразует неизвестную ошибку в Error */
function toError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
}

/** Переинициализирует конфигурацию приложения */
export async function reloadAppConfig(env: NodeJS.ProcessEnv = process.env): Promise<void> {
    const fallbackConfig = createFallbackConfig(env);
    assignConfig(CACHED_CONFIG, fallbackConfig);

    try {
        const { createAppConfig } = await import('./create-app-config');
        const resolvedConfig = createAppConfig(env);
        assignConfig(CACHED_CONFIG, resolvedConfig);
        CONFIG_STATE.error = null;
    } catch (error: unknown) {
        CONFIG_STATE.error = toError(error);
    }
}
