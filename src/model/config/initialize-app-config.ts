import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getPackageName, getPackageVersion } from '../../lib/helpers/version';
import { PACKAGE_RESOURCE_PATHS } from '../constants/main';
import { appConfigSchema } from './schemas';
import type { AppConfig } from './types';

if (process.env.NODE_ENV !== 'test') {
    await import('dotenv/config');
}

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
        } catch {
            // eslint-disable-next-line no-empty
        }
        searchDir = dirname(searchDir);
    }

    return join(dirname(currentFilePath), '../../..');
}

/** Внутреннее хранилище конфигурации */
let appConfigInternal = {} as AppConfig;

/** Глобальная конфигурация приложения */
export const APP_CONFIG = appConfigInternal;

/** Инициализирует конфигурацию приложения из переменных окружения с парсингом API_PROVIDERS */
export function initializeAppConfig(env: NodeJS.ProcessEnv = process.env): void {
    const packageRoot = getPackageRoot();

    const rawConfig = {
        api: {
            key: env.API_KEY,
            mockClientPath: env.API_MOCK_CLIENT_PATH,
            providers: env.API_PROVIDERS
                ? env.API_PROVIDERS.split(',')
                      .map((p) => p.trim())
                      .filter(Boolean)
                : undefined,
            url: env.API_URL,
        },
        logging: {
            level: env.LOG_LEVEL,
        },
        mcp: {
            description:
                env.MCP_SERVER_DESCRIPTION || 'Production-ready MCP validator for Cursor IDE with 4 validation types',
            name: getPackageName(),
            protocolVersion: env.MCP_PROTOCOL_VERSION || '2024-11-05',
            transport: {
                http: {
                    host: env.MCP_HTTP_HOST,
                    port: env.MCP_HTTP_PORT,
                },
                type: env.MCP_TRANSPORT,
            },
            version: getPackageVersion(),
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
        testing: {
            consistencyThresholds: {
                anomalyLengthMultiplier: 0.5,
                anomalyLongMultiplier: 2.0,
                anomalySlowMultiplier: 1.5,
                timeLow: 0.3,
                varianceHigh: 0.7,
                varianceLow: 0.2,
                varianceMedium: 0.5,
            },
        },
        timeouts: {
            apiRequest: env.TIMEOUT_API_REQUEST,
            validation: env.TIMEOUT_VALIDATION,
        },
        validation: {
            limits: {
                contextMaxLength: 5000,
                timeoutMax: 120000,
                timeoutMin: 1000,
            },
        },
    };

    try {
        const validated = appConfigSchema.parse(rawConfig);
        appConfigInternal = validated;
        Object.assign(APP_CONFIG, validated);
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
