import { APP_CONFIG } from '../../model/config';
import type { AgentConfig, OpenAICallResult } from './types';

/** Получает ответ от OpenAI API для проверки информации (E2E или реальный) */
export async function fetchOpenAIForVerification(
    agent: AgentConfig,
    verificationPrompt: string,
): Promise<OpenAICallResult> {
    const startTime = Date.now();
    const config = APP_CONFIG;

    if (config.runtime.isE2ETest) {
        const { getOpenRouterClient } = await import('../../services/adapters/openrouter/openrouter-client-factory');
        const mockClient = await getOpenRouterClient();
        const mockResponse = await mockClient({
            prompt: verificationPrompt,
        });

        const duration = Date.now() - startTime;

        return {
            duration,
            responseContent: mockResponse.text,
            tokensUsed: mockResponse.tokensUsed,
            ...(mockResponse.provider ? { provider: mockResponse.provider } : {}),
            ...(mockResponse.totalCost ? { totalCost: mockResponse.totalCost } : {}),
        };
    }

    const requestBody = {
        max_tokens: config.model.maxTokens,
        messages: [
            {
                content: agent.instructions,
                role: 'system' as const,
            },
            {
                content: verificationPrompt,
                role: 'user' as const,
            },
        ],
        model: agent.model,
        temperature: config.model.temperature,
        ...(agent.providers &&
            agent.providers.length > 0 && {
                extra_body: {
                    providers: agent.providers,
                },
            }),
    };

    const response = await agent.openai.chat.completions.create(requestBody);

    const duration = Date.now() - startTime;

    const getHeaderValue = (headers: unknown, headerName: string): string | undefined => {
        if (headers === null || headers === undefined) {
            return undefined;
        }

        if (headers instanceof Headers) {
            return headers.get(headerName) || undefined;
        }

        if (typeof headers === 'object') {
            const headerObj = headers as Record<string, string[] | string | undefined>;
            const header = headerObj[headerName] || headerObj[headerName.toLowerCase()];
            if (header === null || header === undefined) {
                return undefined;
            }

            return Array.isArray(header) ? header[0] : header;
        }

        return undefined;
    };

    const rawHeaders =
        (response as { headers?: unknown; rawResponse?: { headers?: unknown } }).headers ||
        (response as { rawResponse?: { headers?: unknown } }).rawResponse?.headers;

    const provider = rawHeaders ? getHeaderValue(rawHeaders, 'x-provider') : undefined;
    const totalCost = rawHeaders
        ? getHeaderValue(rawHeaders, 'x-total-cost') || getHeaderValue(rawHeaders, 'x-tokens-total-cost')
        : undefined;

    return {
        duration,
        responseContent: response.choices[0]?.message?.content || '',
        tokensUsed: response.usage?.total_tokens || 0,
        ...(provider ? { provider } : {}),
        ...(totalCost ? { totalCost } : {}),
    };
}
