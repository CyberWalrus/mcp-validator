import { join, resolve } from 'node:path';

import { PACKAGE_RESOURCE_PATHS } from '../../constants/main';
import type { AppConfig } from '../../types/main';
import { getPackageRoot } from './get-package-root';

/** Создает fallback конфигурацию приложения */
export function createFallbackConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
    const packageRoot = getPackageRoot();

    return {
        api: {
            key: '',
            mockClientPath: 'end-to-end/mocks/openrouter-test-client',
            provider: 'openrouter',
            url: 'https://openrouter.ai/api/v1',
        },
        logging: {
            level: 'INFO',
        },
        model: {
            maxTokens: 100000,
            name: 'openai/gpt-oss-120b',
            temperature: 0.5,
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
            apiRequest: 30000,
            validation: 30000,
        },
    };
}
