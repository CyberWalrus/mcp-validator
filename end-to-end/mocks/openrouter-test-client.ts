import type { OpenRouterRequest, OpenRouterResponse } from '../../src/services/adapters/openrouter/types';
import type { MockedOpenRouterResponse } from '../types';

/** Глобальная очередь мок-ответов для тестирования */
let mockResponsesQueue: MockedOpenRouterResponse[] = [];

/** Устанавливает мок-ответ для следующего запроса */
export function setMockResponse(response: MockedOpenRouterResponse): void {
    mockResponsesQueue.push(response);
}

/** Очищает очередь мок-ответов */
export function clearMockResponses(): void {
    mockResponsesQueue = [];
}

/** Тестовая версия клиента OpenRouter, использует моки */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function makeOpenRouterRequest(_request: OpenRouterRequest): Promise<OpenRouterResponse> {
    const startTime = Date.now();

    // Получаем следующий мок-ответ
    const mockResponse = mockResponsesQueue.shift();
    if (!mockResponse) {
        // Если нет мок-ответов, создаем дефолтный для валидации
        const defaultResponse = {
            choices: [
                {
                    message: {
                        content: JSON.stringify({
                            feedback: 'Тестовый мок-ответ для валидации',
                            score: 85,
                            suggestions: ['Добавьте JSDoc комментарии', 'Улучшите обработку ошибок'],
                        }),
                    },
                },
            ],
            model: 'test-model',
            provider: 'OpenAI',
            totalCost: '0.0015',
            usage: { total_tokens: 100 },
        } as MockedOpenRouterResponse;

        // Добавляем минимальную задержку для реалистичного duration
        await new Promise((resolve) => {
            setTimeout(resolve, 1);
        });

        const duration = Date.now() - startTime;
        const choice = defaultResponse.choices[0];

        if (!choice || !choice.message) {
            return Promise.reject(new Error('Некорректный дефолтный мок-ответ'));
        }

        const result: OpenRouterResponse = {
            duration,
            model: defaultResponse.model,
            text: choice.message.content,
            tokensUsed: defaultResponse.usage.total_tokens,
        };

        const defaultWithMetadata = defaultResponse as { provider?: string; totalCost?: string };
        if (defaultWithMetadata.provider) {
            result.provider = defaultWithMetadata.provider;
        }
        if (defaultWithMetadata.totalCost) {
            result.totalCost = defaultWithMetadata.totalCost;
        }

        return Promise.resolve(result);
    }

    // Добавляем минимальную задержку для реалистичного duration
    await new Promise((resolve) => {
        setTimeout(resolve, 1);
    });

    const duration = Date.now() - startTime;

    // Преобразуем мок-ответ в формат OpenRouter
    const choice = mockResponse.choices[0];
    if (!choice || !choice.message) {
        return Promise.reject(new Error('Некорректный мок-ответ'));
    }

    const result: OpenRouterResponse = {
        duration,
        model: mockResponse.model,
        text: choice.message.content,
        tokensUsed: mockResponse.usage.total_tokens,
    };

    const mockWithMetadata = mockResponse as { provider?: string; totalCost?: string };
    if (mockWithMetadata.provider) {
        result.provider = mockWithMetadata.provider;
    }
    if (mockWithMetadata.totalCost) {
        result.totalCost = mockWithMetadata.totalCost;
    }

    return Promise.resolve(result);
}
