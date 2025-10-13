import { APP_CONFIG } from '../../../model/config';
import type { OpenRouterClientFunction } from './types';

let cachedClient: OpenRouterClientFunction | null = null;

/** Получает правильный OpenRouter клиент в зависимости от режима */
export async function getOpenRouterClient(): Promise<OpenRouterClientFunction> {
    if (cachedClient) {
        return cachedClient;
    }

    const config = APP_CONFIG;
    const { isE2ETest } = config.runtime;

    if (isE2ETest) {
        const { mockClientPath } = config.api;
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
