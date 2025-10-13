import { APP_CONFIG } from '../../../../model/config';
import type { OpenRouterRequest, OpenRouterResponse } from '../../../adapters/openrouter/types';

type OpenRouterClientFunction = (request: OpenRouterRequest) => Promise<OpenRouterResponse>;

let openRouterClient: OpenRouterClientFunction | null = null;

/** Получает правильный OpenRouter клиент в зависимости от режима */
export async function getOpenRouterClient(): Promise<OpenRouterClientFunction> {
    if (openRouterClient) {
        return openRouterClient;
    }

    const config = APP_CONFIG;

    if (config.runtime.environment === 'test' && config.runtime.isE2ETest) {
        const { getOpenRouterClient: createOpenRouterClient } = await import(
            '../../../adapters/openrouter/openrouter-client-factory'
        );
        openRouterClient = await createOpenRouterClient();
    } else {
        const { makeOpenRouterRequest } = await import('../../../adapters/openrouter/openrouter-real-client');
        openRouterClient = makeOpenRouterRequest;
    }

    return openRouterClient;
}
