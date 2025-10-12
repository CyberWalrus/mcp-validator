import { APP_CONFIG, getAppConfigError } from '../../../model/config';
import type { AppConfig } from '../../../model/types/main';
import type { OpenRouterClientFunction } from './types';

let cachedClient: OpenRouterClientFunction | null = null;

/** Возвращает конфигурацию приложения или бросает ошибку */
function getConfigOrThrow(): AppConfig {
    const config = APP_CONFIG;
    const configError = getAppConfigError();

    if (!config || configError) {
        const message = configError?.message ?? 'Конфигурация приложения недоступна';
        throw new Error(message);
    }

    return config;
}

/** Получает правильный OpenRouter клиент в зависимости от режима */
export async function getOpenRouterClient(): Promise<OpenRouterClientFunction> {
    if (cachedClient) {
        return cachedClient;
    }

    const config = getConfigOrThrow();
    const { isTestMode } = config.runtime;

    if (isTestMode) {
        const { mockClientPath } = config.openRouter;
        const mockClient = (await import(mockClientPath)) as { makeOpenRouterRequest?: OpenRouterClientFunction };
        if (mockClient.makeOpenRouterRequest) {
            cachedClient = mockClient.makeOpenRouterRequest;
        } else {
            throw new Error('Мок клиент не содержит функцию makeOpenRouterRequest');
        }
    } else {
        const { makeOpenRouterRequest } = await import('./openrouter-real-client');
        cachedClient = makeOpenRouterRequest;
    }

    return cachedClient;
}
