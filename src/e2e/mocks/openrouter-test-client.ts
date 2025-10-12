import type { OpenRouterRequest, OpenRouterResponse } from '../../services/adapters/openrouter/types';
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
export function makeOpenRouterRequest(_request: OpenRouterRequest): Promise<OpenRouterResponse> {
    const startTime = Date.now();

    // Получаем следующий мок-ответ
    const mockResponse = mockResponsesQueue.shift();
    if (!mockResponse) {
        // Если нет мок-ответов, создаем дефолтный для валидации
        const defaultResponse: MockedOpenRouterResponse = {
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
            usage: { total_tokens: 100 },
        };

        const duration = Date.now() - startTime;
        const choice = defaultResponse.choices[0];

        if (!choice || !choice.message) {
            return Promise.reject(new Error('Некорректный дефолтный мок-ответ'));
        }

        return Promise.resolve({
            duration,
            model: defaultResponse.model,
            text: choice.message.content,
            tokensUsed: defaultResponse.usage.total_tokens,
        });
    }

    // Мгновенные мок-ответы для быстрого тестирования
    // (убрана искусственная задержка 100мс)

    const duration = Date.now() - startTime;

    // Преобразуем мок-ответ в формат OpenRouter
    const choice = mockResponse.choices[0];
    if (!choice || !choice.message) {
        return Promise.reject(new Error('Некорректный мок-ответ'));
    }

    return Promise.resolve({
        duration,
        model: mockResponse.model,
        text: choice.message.content,
        tokensUsed: mockResponse.usage.total_tokens,
    });
}
